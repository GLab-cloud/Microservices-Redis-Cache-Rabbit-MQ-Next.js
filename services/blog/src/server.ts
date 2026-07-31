import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
dotenv.config();
const app = express(); 
const port = process.env.PORT || 5002;
app.use('/api/v1', blogRoutes); 

app.listen(port, () => {
  console.log(`Blog service is running on http://localhost:${port}`);
})