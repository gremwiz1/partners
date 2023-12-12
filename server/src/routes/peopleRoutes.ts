import express from 'express';
import { listUsers } from '../controllers/peopleController';

const router = express.Router();

router.get('/people', listUsers);

export default router;
