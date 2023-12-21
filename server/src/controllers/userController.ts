import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { API_BASE_URL } from "../utils/const";
import path from "path";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, birthdate, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      birthdate,
      gender,
    });
    if (req.file) {
      const normalizedPath = path.normalize(req.file.path).replace(/\\/g, "/");
      newUser.profilePhoto = `${API_BASE_URL}/${normalizedPath}`;
    }
    await newUser.save();
    const { password: hash, ...newuUserWithoutPassword } = newUser.toObject({
      getters: true,
      virtuals: false,
    });
    res
      .status(201)
      .json({
        message: "Пользователь успешно зарегистрирован",
        newuUserWithoutPassword,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Ошибка при регистрации пользователя", error });
  }
};

export { registerUser };
