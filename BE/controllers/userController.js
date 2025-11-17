import db from "../models/index.js";  

import bcrypt from "bcryptjs";
const { User } = db;

// ✅ Ambil semua user
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ["id", "name", "email", "role"] });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// ✅ Ambil user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "role"],
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// ✅ Tambah user baru
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role} = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed, role: "cashier" });
    res.status(201).json({
      message: "User berhasil ditambahkan",
      data: { id: newUser.id, name, email, role },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update user
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });

    // ✳️ Filter field yang boleh diupdate
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;

    // ✳️ Update password jika dikirim
    if (password && password.trim() !== "") {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    // // ✳️ Normalisasi role agar sesuai ENUM di DB
    // if (role) {
    //   const safeRole = role.trim().toLowerCase();
    //   const validRoles = ["admin", "cashier", "owner"];
    //   updatedData.role = validRoles.includes(safeRole) ? safeRole : user.role;
    // }

    // 🔥 Jalankan update
    await user.update(updatedData);

    res.json({
      success: true,
      message: "User berhasil diperbarui",
      data: {
        id: user.id,
        name: updatedData.name || user.name,
        email: updatedData.email || user.email,
        role: updatedData.role || user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ✅ Hapus user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    await user.destroy();
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};
