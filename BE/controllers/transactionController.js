import db from "../models/index.js";
const { Transaction, TransactionItem, Product, User } = db;

// 💰 CREATE TRANSACTION
export const createTransaction = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { items, order_type, customer_name, table_number } = req.body;
    const userId = req.user?.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Item transaksi wajib diisi" });
    }

    // Hitung subtotal & total
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.qty;
    }
    const tax = Math.round(subtotal * 0.1); // 10% pajak
    const total = subtotal + tax;

    // Ambil order_number terakhir
    const lastTrx = await Transaction.findOne({ order: [["id", "DESC"]] });
    const order_number = lastTrx ? lastTrx.order_number + 1 : 1;

    // 🧾 Buat transaksi utama
    const transaction = await Transaction.create(
      {
        users_id: userId,
        order_type,
        customer_name,
        table_number,
        subtotal,
        tax,
        total,
        order_number,
      },
      { transaction: t }
    );

    // 🧾 Tambahkan item transaksi
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);

      if (!product) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: `Produk ID ${item.product_id} tidak ditemukan`,
        });
      }

      if (product.quantity < item.qty) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Stok tidak cukup untuk produk ${product.title}`,
        });
      }

      await TransactionItem.create(
        {
          transaction_id: transaction.id,
          product_id: item.product_id,
          qty: item.qty,
          price: item.price,
          subtotal_item: item.price * item.qty,
          notes: item.notes || "",
        },
        { transaction: t }
      );

      // Kurangi stok produk
      await product.update(
        { quantity: product.quantity - item.qty },
        { transaction: t }
      );
    }

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat",
      data: { transaction },
    });
  } catch (error) {
    await t.rollback();
    console.error("❌ Error createTransaction:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat transaksi",
      error: error.message,
    });
  }
};

// 💰 GET ALL TRANSACTIONS
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: TransactionItem,
          include: [{ model: Product, attributes: ["title", "price"] }],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("❌ Error getAllTransactions:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data transaksi",
      error: error.message,
    });
  }
};

// 💰 GET TRANSACTION BY ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        {
          model: TransactionItem,
          include: [{ model: Product, attributes: ["title", "price"] }],
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaksi tidak ditemukan" });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error("❌ Error getTransactionById:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data transaksi",
      error: error.message,
    });
  }
};

// 💰 DELETE TRANSACTION
export const deleteTransaction = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [TransactionItem],
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaksi tidak ditemukan" });
    }

    // Kembalikan stok produk
    for (const item of transaction.TransactionItems) {
      const product = await Product.findByPk(item.product_id);
      if (product) {
        await product.update(
          { quantity: product.quantity + item.qty },
          { transaction: t }
        );
      }
    }

    // Hapus item dan transaksi
    await TransactionItem.destroy(
      { where: { transaction_id: transaction.id } },
      { transaction: t }
    );
    await transaction.destroy({ transaction: t });

    await t.commit();
    res.status(200).json({
      success: true,
      message: "Transaksi berhasil dihapus",
    });
  } catch (error) {
    await t.rollback();
    console.error("❌ Error deleteTransaction:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus transaksi",
      error: error.message,
    });
  }
};
