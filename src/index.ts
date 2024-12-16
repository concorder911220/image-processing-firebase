import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import cookieParser from "cookie-parser";
import { seedData } from "./config/seed";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
seedData();
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/service", serviceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
