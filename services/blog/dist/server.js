import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
import { createClient } from "redis";
import { startCacheInvalidationConsumer } from "./utils/consumer.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5002;
await startCacheInvalidationConsumer();
export const redisClient = createClient({
    url: process.env.REDIS_REST_URL,
});
await redisClient.connect().then(() => {
    console.log("Connected to Redis");
}).catch((err) => {
    console.log("Redis connection error", err);
});
app.use('/api/v1', blogRoutes);
app.listen(port, () => {
    console.log(`Blog service is running on http://localhost:${port}`);
});
