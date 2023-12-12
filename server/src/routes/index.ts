import express from 'express';
import registerRoutes from './registerRoutes';
import loginRoutes from './loginRoutes';
import accountRoutes from './accountRoutes';
import peopleRoutes from './peopleRoutes';

const router = express.Router();

router.use(registerRoutes);
router.use(loginRoutes);
router.use(accountRoutes);
router.use(peopleRoutes);

export default router;
