import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDb from "./utils/db.js";
import userRoutes from "./routes/user.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

dotenv.config();
// Configuration
cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api_Key,
  api_secret: process.env.Cloud_Api_Secret,
});

const app = express();
app.use(express.json());
console.log(">>> FRONTEND_URL:", process.env.FRONTEND_URL);
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
connectDb();
app.use("/api/v1", userRoutes);
//console.log(process.env.MONGO_URI);
const port = process.env.PORT;
app.listen(port, '0.0.0.0',() => {
  console.log(`Server is running on http://localhost:${port}`);
});
