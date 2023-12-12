import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Генерация токена
    const secret = process.env.JWT_SECRET || 'fallback_secret'; // Альтернативный секретный ключ
    const token = jwt.sign(
      { userId: user._id },
      secret,
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Вы успешно вошли в систему' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при входе в систему', error });
  }
};

export { loginUser };
