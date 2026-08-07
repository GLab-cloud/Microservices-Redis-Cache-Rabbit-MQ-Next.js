import amqp from 'amqplib';
import { createClient } from 'redis';
interface CacheInvalidationMessage {
    action: string;
    keys: string[];
}

export const startCacheInvalidationConsumer = async () => {
    try {
        const redisClient = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
        redisClient.on('error', (err) => console.error('Redis Client Error', err));
        await redisClient.connect();
        const connection = await amqp.connect({protocol: 'amqp', hostname: 'localhost', port: 5672, username: process.env.RABBITMQ_USERNAME, password: process.env.RABBITMQ_PASSWORD});
        const channel = await connection.createChannel();
        const queueName = 'cache-invalidation';
        await channel.assertQueue(queueName, { durable: false });
        console.log("🚀 Blog Cache Invalidation Consumer started and connected to RabbitMQ!");
        channel.consume(queueName, async (msg) => {
            if (msg) {
                const content= JSON.parse(msg.content.toString()) as CacheInvalidationMessage;
                console.log("🗑️ Blog service received cache invalidation message");
                if (content.action === 'invalidate_cache') {
                    // Here you would call your cache invalidation logic, e.g., invalidateCache(content.keys);
                    for (const pattern of content.keys) {
                        console.log(`🗑️ Invalidating cache for key: ${pattern}`);
                        // Call your cache invalidation function here
                        const keys = await redisClient.keys(pattern);
                        for (const k of keys) {
                            await redisClient.del(k);
                            console.log(`✅ Deleted cache key: ${k}`);
                        }
                    }
                }
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("❌ Error starting cache invalidation consumer:", error);
        throw error;
    }
}