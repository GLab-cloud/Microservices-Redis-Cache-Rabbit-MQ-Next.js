import { redisClient } from "../server.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/trycatch.js";
import axios from "axios";
export const getAllBlogs = TryCatch(async (req, res) => {
    const { searchQuery = "", category = "" } = req.query;
    const cacheKey = `blogs:${searchQuery}:${category}`;
    const cachedBlogs = await redisClient.get(cacheKey);
    if (cachedBlogs) {
        console.log("Blogs fetched from Redis cache");
        return res.status(200).json(JSON.parse(cachedBlogs));
    }
    let blogs;
    if (searchQuery && category) {
        blogs = await sql `SELECT * FROM blogs WHERE title ILIKE ${'%' + searchQuery + '%'} AND category = ${category} ORDER BY created_at DESC`;
    }
    else if (searchQuery) {
        blogs = await sql `SELECT * FROM blogs WHERE title ILIKE ${'%' + searchQuery + '%'} ORDER BY created_at DESC`;
    }
    else if (category) {
        blogs = await sql `SELECT * FROM blogs WHERE category = ${category} ORDER BY created_at DESC`;
    }
    else {
        blogs = await sql `SELECT * FROM blogs ORDER BY created_at DESC`;
    }
    res.status(200).json(blogs);
    await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3600 }); // Cache for 1 hour 
    console.log("Blogs fetched successfully from database", blogs);
});
export const getBlogById = TryCatch(async (req, res) => {
    const { id } = req.params;
    const cacheKey = `blog:${id}`;
    const cachedBlog = await redisClient.get(cacheKey);
    if (cachedBlog) {
        console.log("Blog fetched from Redis cache");
        return res.status(200).json(JSON.parse(cachedBlog));
    }
    const blog = await sql `SELECT * FROM blogs WHERE id = ${id}`;
    if (blog.length === 0) {
        res.status(404).json({ message: "Blog not found" });
        return;
    }
    const { data } = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${blog[0].author}`);
    const responseData = { blog: blog[0], author: data };
    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3600 }); // Cache for 1 hour
    console.log("Blog fetched successfully from database", responseData);
    return res.status(200).json(responseData);
});
