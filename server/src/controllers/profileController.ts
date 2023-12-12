import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';

const updateUserProfile = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Нет доступа' });
    }

    try {
        const { name, email, birthdate, gender, password } = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (birthdate) user.birthdate = birthdate;
        if (gender) user.gender = gender;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (req.file) user.profilePhoto = req.file.path;

        await user.save();
        res.json({ message: 'Профиль успешно обновлен', user: user.toObject({ getters: true, virtuals: false }) });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении профиля', error });
    }
};

export { updateUserProfile };
