import express from "express";
import { listUsers } from "../controllers/peopleController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/people", verifyToken, listUsers);
export default router;
