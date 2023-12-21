import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { API_BASE_URL } from "../utils/const";
import path from "path";

const updateUserProfile = async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user || !user.userId) {
    return res.status(401).json({ message: "Нет доступа" });
  }
  const userId = user.userId;

  try {
    const { name, email, birthdate, gender, password } = req.body;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (name) userData.name = name;
    if (email) userData.email = email;
    if (birthdate) userData.birthdate = birthdate;
    if (gender) userData.gender = gender;
    if (password) userData.password = await bcrypt.hash(password, 10);
    if (req.file) {
      const normalizedPath = path.normalize(req.file.path).replace(/\\/g, "/");
      userData.profilePhoto = `${API_BASE_URL}/${normalizedPath}`;
    }

    await userData.save();
    const { password: hashedPassword, ...userWithoutPassword } =
      userData.toObject({ getters: true, virtuals: false });
    res.json({
      message: "Профиль успешно обновлен",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении профиля", error });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user || !user.userId) {
    return res.status(401).json({ message: "Нет доступа" });
  }

  try {
    const currentUserId = user.userId;
    const userProfile = await User.findById(currentUserId).select("-password");

    res.json(userProfile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении пользователя", error });
  }
};

export { updateUserProfile, getUserProfile };
