import { Request, Response } from "express";
import User from "../models/user";

const listUsers = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Нет доступа" });
  }

  try {
    const currentUserId = req.user.userId;
    const users = await User.find({ _id: { $ne: currentUserId } }).select("-password"); 

    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении списка пользователей", error });
  }
};

export { listUsers };
