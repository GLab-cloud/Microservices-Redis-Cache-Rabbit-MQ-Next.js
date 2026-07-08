import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoutes from "./routes/user.js";
dotenv.config();
const app = express();
app.use(express.json());
connectDb();
app.use("/api/v1", userRoutes);
console.log(process.env.MONGO_URI);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
