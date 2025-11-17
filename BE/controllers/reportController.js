import db from "../models/index.js";
const { Transaction, TransactionItem, Product } = db;
const { Op } = db.Sequelize;

// 📊 Laporan Penjualan
export const getSalesReport = async (req, res) => {
  try {
    const start_date = req.query.start_date || req.query.startDate;
    const end_date = req.query.end_date || req.query.endDate;

    const where = {};
    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const transactions = await Transaction.findAll({
      where,
      include: [
        {
          model: TransactionItem,
          include: [
            { model: Product, attributes: ["title", "price", "category"] }, // ✅ FIXED
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    let total_sales = 0;
    let total_revenue = 0;

    transactions.forEach((trx) => {
      trx.TransactionItems.forEach((item) => {
        total_sales += item.qty;
        total_revenue += item.subtotal_item;
      });
    });

    res.status(200).json({
      success: true,
      start_date,
      end_date,
      total_transactions: transactions.length,
      total_sales,
      total_revenue,
      transactions,
    });
  } catch (error) {
    console.error("❌ Error in getSalesReport:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil laporan penjualan",
      error: error.message,
    });
  }
};
