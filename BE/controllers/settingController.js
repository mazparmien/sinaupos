import { Setting } from "../models/index.js";

export const getSettings = async (req, res) => {
  const settings = await Setting.findAll();
  res.json(settings);
};

export const updateSetting = async (req, res) => {
  const { key, value } = req.body;
  const setting = await Setting.findOne({ where: { key } });
  if (!setting) return res.status(404).json({ message: "Setting not found" });
  await setting.update({ value });
  res.json(setting);
};
