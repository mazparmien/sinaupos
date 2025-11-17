import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { User } = db;

// 📝 REGISTER USER
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: "User Name sudah terdaftar" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json({
      message: "Registrasi berhasil",
      data: { id: user.id, name, email, role },
    });
  } catch (error) {
    next(error);
  }
};

// 🔐 LOGIN USER
export const loginUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;
 
    const user = await User.findOne({ where: { name } });
    if (!user) return res.status(401).json({ message: "User Name atau password salah" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "User Name atau password salah" });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// 👤 GET PROFILE
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
