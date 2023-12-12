import express from 'express';
import { registerUser } from '../controllers/userController';
import { body } from 'express-validator';
import upload from '../utils/fileUpload';

const router = express.Router();

router.post('/register',
  upload.single('profilePhoto'), // Обработка загрузки изображения 
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('birthdate').not().isEmpty().withMessage('Birthdate is required'),
  body('gender').not().isEmpty().withMessage('Gender is required'),
  registerUser
);

export default router;
