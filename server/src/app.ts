import express from "express";
import { securityMiddleware } from "./middlewares/securityMiddleware";
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware";
import routes from "./routes";
import connectDatabase from "./database";
import logRequests from "./middlewares/logRequests";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;

app.use(logRequests);
connectDatabase();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(securityMiddleware);
app.use(rateLimitMiddleware);
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
