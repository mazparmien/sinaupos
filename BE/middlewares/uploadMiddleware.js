import multer from "multer";
import path from "path";
import fs from "fs";

// Pastikan folder uploads ada
// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const fileName = `menu-${Date.now()}${ext}`;
//     cb(null, fileName);
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 }, // max 2 MB
//   fileFilter: (req, file, cb) => {
//     const allowed = ["image/jpeg", "image/png", "image/jpg"];
//     if (!allowed.includes(file.mimetype)) {
//       cb(new Error("Invalid file type. Only JPG, JPEG, PNG allowed."));
//     } else {
//       cb(null, true);
//     }
//   },
// });



const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `menu-${Date.now()}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    cb(allowed.includes(file.mimetype) ? null : new Error("Invalid file type"), true);
  },
});
