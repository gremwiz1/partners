import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";

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
      profilePhoto: req.file?.path,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Пользователь успешно зарегистрирован", newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при регистрации пользователя", error });
  }
};

export { registerUser };
