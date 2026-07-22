import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "./utils/db.js";
import blogRoutes from "./routes/blog.js";
dotenv.config();
// Configuration
cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api_Key,
    api_secret: process.env.Cloud_Api_Secret,
});
const app = express();
app.use("/api/v1", blogRoutes);
const port = process.env.PORT;
async function initDB() {
    try {
        await sql `CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,    
    description VARCHAR(255) NOT NULL,
    blogcontent TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
        await sql `CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY, 
    comment TEXT NOT NULL,    
    userid VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    blogid VARCHAR(255) NOT NULL,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
        await sql `CREATE TABLE IF NOT EXISTS savedblogs (
    id SERIAL PRIMARY KEY, 
    userid VARCHAR(255) NOT NULL,
    blogid VARCHAR(255) NOT NULL,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
        console.log("database initialized successfully");
        const tables = await sql `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
        console.log("Tables in database:", tables.map(t => t.table_name).join(", "));
    }
    catch (error) {
        console.error("Error initializing database:", error);
    }
}
initDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
