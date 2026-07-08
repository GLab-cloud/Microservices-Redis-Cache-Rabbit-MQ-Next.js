import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
dotenv.config();
const app = express();
connectDb();
console.log(process.env.MONGO_URI);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
