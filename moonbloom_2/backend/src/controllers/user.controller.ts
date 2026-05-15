import { Request, Response } from "express";
import User from "../models/user.model";
import Cycle from "../models/cycle.model";
import DailyLog from "../models/dailyLog.model";
import cloudinary from "../config/cloudinary";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("Usuario no encontrado"); }
  res.json(user);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const user = new User(req.body);
  const savedUser = await user.save();
  res.status(201).json(savedUser);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
  if (!updated) { res.status(404); throw new Error("Usuario no encontrado"); }
  res.json(updated);
};

export const updateCurrentUserProfile = async (req: Request, res: Response): Promise<void> => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();

  if (!name) {
    res.status(400).json({ success: false, message: "El nombre es obligatorio" });
    return;
  }

  if (!email) {
    res.status(400).json({ success: false, message: "El correo electrónico es obligatorio" });
    return;
  }

  const existing = await User.findOne({
    email,
    _id: { $ne: req.user!._id }
  });

  if (existing) {
    res.status(400).json({ success: false, message: "Ya existe una cuenta con ese correo electrónico" });
    return;
  }

  const updated = await User.findByIdAndUpdate(
    req.user!._id,
    { name, email },
    { returnDocument: "after", runValidators: true }
  );

  if (!updated) {
    res.status(404).json({ success: false, message: "Usuario no encontrado" });
    return;
  }

  res.json({ success: true, user: updated });
};

export const updateCurrentUserPhoto = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ success: false, message: "Selecciona una imagen" });
    return;
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    res.status(500).json({ success: false, message: "Cloudinary no está configurado" });
    return;
  }

  const uploadResult: any = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "moonbloom/profile-photos",
        resource_type: "image",
        transformation: [
          { width: 500, height: 500, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" }
        ]
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("No se pudo subir la imagen"));
          return;
        }

        resolve(result);
      }
    );

    stream.end(req.file!.buffer);
  });

  if (req.user!.profileImagePublicId) {
    cloudinary.uploader.destroy(req.user!.profileImagePublicId).catch((err) => {
      console.error("[cloudinary] Error eliminando foto anterior:", err.message);
    });
  }

  const updated = await User.findByIdAndUpdate(
    req.user!._id,
    {
      profileImageUrl: uploadResult.secure_url,
      profileImagePublicId: uploadResult.public_id
    },
    { returnDocument: "after", runValidators: true }
  );

  if (!updated) {
    res.status(404).json({ success: false, message: "Usuario no encontrado" });
    return;
  }

  res.json({ success: true, user: updated });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) { res.status(404); throw new Error("Usuario no encontrado"); }
  res.json({ message: "Usuario eliminado correctamente" });
};

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const lastCycle = await Cycle.findOne({ userId }).sort({ startDate: -1 }).lean();
    const totalCycles = await Cycle.countDocuments({ userId });
    const totalLogs   = await DailyLog.countDocuments({ userId });
    const lastLog = await DailyLog.findOne({ userId }).sort({ date: -1 }).lean();

    res.json({
      user: {
        name: req.user!.name,
        profileImageUrl: req.user!.profileImageUrl
      },
      lastCycle,
      totalCycles,
      totalLogs,
      lastLog
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
