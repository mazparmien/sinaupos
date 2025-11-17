import db from "../models/index.js";
import fs from "fs";
import path from "path";

const { Product, TransactionItem } = db;

// 📦 Tambah produk baru (dengan upload)
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // 🔥 hanya path

    const newProduct = await Product.create({
      title,
      description,
      price,
      category,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      data: newProduct,
    });
  } catch (error) {
    console.error("❌ Error createProduct:", error);
    next(error);
  }
};

// 📦 Ambil semua produk (dengan filter kategori opsional)
export const getAllProducts = async (req, res, next) => {
  try {
    const { category } = req.query;

    const whereClause = { deleted_at: null };

    // kalau ada ?category= di query, konversi ke format ENUM Postgres
    if (category && category !== "all") {
      const enumMap = {
        food: "Foods",
        drink: "Beverages",
        other: "Dessert",
        foods: "Foods",
        beverages: "Beverages",
        dessert: "Dessert",
      };

      whereClause.category = enumMap[category] || category;
    }

    const products = await Product.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("❌ Error getAllProducts:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
      error: error.message,
    });
  }
};

// 📦 Ambil produk berdasarkan ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Produk tidak ditemukan" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("❌ Error getProductById:", error);
    next(error);
  }
};

// 📦 Update produk (dengan dukungan ganti gambar)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produk tidak ditemukan" });
    }

    const { title, description, price, category } = req.body;
    // 🔹 Simpan path lama dulu
    let imagePath = product.image;
    // 🔹 Kalau user upload gambar baru
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      // Hapus file lama jika ada dan valid
      if (product.image) {
        const oldPath = path.join(
          process.cwd(),
          product.image.replace(/^\//, "")
        );
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.warn("⚠️ Gagal hapus gambar lama:", err.message);
          }
        }
      }
    }

    // 🔹 Update data produk
    await product.update({
      title,
      description,
      price,
      category,
      image: imagePath,
    });

    res.status(200).json({
      success: true,
      message: "Produk berhasil diperbarui",
      data: product,
    });
  } catch (error) {
    console.error("❌ Error updateProduct:", error);
    next(error);
  }
};
// export const updateProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findByPk(req.params.id);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Produk tidak ditemukan" });
//     }

//     const { title, description, price, category } = req.body;
//     // 🔹 Cek apakah ada file gambar baru
//     let imagePath = product.image;
//     if (req.file) {
//       imagePath = `/uploads/${req.file.filename}`;

//       // 🔥 Hapus file lama jika ada
//       if (
//         product.image &&
//         fs.existsSync(path.join(process.cwd(), product.image))
//       ) {
//         try {
//           fs.unlinkSync(path.join(process.cwd(), product.image));
//         } catch (err) {
//           console.warn("⚠️ Gagal hapus gambar lama:", err.message);
//         }
//       }
//     }

//     // 🔹 Update data produk
//     await product.update({
//       title,
//       description,
//       price,
//       category,
//       image: imagePath,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Produk berhasil diperbarui",
//       data: product,
//     });
//   } catch (error) {
//     console.error("❌ Error updateProduct:", error);
//     next(error);
//   }
// };

// 📦 Hapus produk (cek foreign key)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah produk masih dipakai di transaksi
    const isUsed = await TransactionItem.findOne({ where: { product_id: id } });
    if (isUsed) {
      return res.status(400).json({
        success: false,
        message:
          "Produk tidak dapat dihapus karena sudah digunakan dalam transaksi",
      });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produk tidak ditemukan" });
    }

    await product.destroy();
    res.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("❌ Error deleteProduct:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus produk" });
  }
};
