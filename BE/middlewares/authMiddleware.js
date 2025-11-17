import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ✅ Middleware untuk verifikasi token JWT
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Akses ditolak. Token tidak ada." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Simpan data user dari token
    next();
  } catch (error) {
    console.error("❌ JWT Verify Error:", error.message);
    res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa." });
  }
};

// ✅ Middleware untuk membatasi akses berdasarkan role
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Kamu tidak punya akses ke fitur ini." });
    }
    next();
  };
};
