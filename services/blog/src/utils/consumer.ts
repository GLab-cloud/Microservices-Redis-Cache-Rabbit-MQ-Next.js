import amqp from 'amqplib';
import { redisClient } from '../server.js';
import { sql } from './db.js';

interface CacheInvalidationMessage {
    action: string;
    keys: string[];
}

export const startCacheInvalidationConsumer = async () => {
    const connection = await amqp.connect({
        protocol: 'amqp',
        hostname: 'localhost',
        port: 5672,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD,
    });
    const channel = await connection.createChannel();
    const queueName = 'cache-invalidation';
    await channel.assertQueue(queueName, { durable: true });
    console.log('🚀 Blog Cache Invalidation Consumer started and connected to RabbitMQ!');

    channel.consume(queueName, async (msg: amqp.ConsumeMessage | null) => {
        if (!msg) {
            console.warn('⚠️ Received null message from RabbitMQ, skipping');
            return;
        }

        try {
            const content = JSON.parse(msg.content.toString()) as CacheInvalidationMessage;

            if (content.action === 'invalidate_cache' && Array.isArray(content.keys)) {
                console.log('🗑️ Blog service received cache invalidation message');

                for (const pattern of content.keys) {
                    console.log(`🗑️ Invalidating cache for key: ${pattern}`);

                    const keys = await redisClient.keys(pattern);

                    if (keys.length === 0) {
                        console.log(`⚠️ No cache keys found for pattern: ${pattern}`);
                        continue;
                    }

                    await redisClient.del(keys);
                    console.log(`✅ Deleted ${keys.length} cache key(s) for pattern: ${pattern}`);
                    const category="";
                    const searchQuery="";
                    const cacheKey = `blogs:${searchQuery}:${category}`;
                    const blogs=await sql`SELECT * FROM blogs ORDER BY created_at DESC`;  
                    await redisClient.set(cacheKey, JSON.stringify(blogs), {EX: 3600}); // Cache for 1 hour 
                    console.log(`✅ Cache rebuilt successfully for key: ${cacheKey}`);     
                    console.log(`✅ Blog service: cache invalidation completed for patterns: ${content.keys.join(', ')}`);

                }

            }
            channel.ack(msg);
        } catch (error) {
            console.error('❌ Error processing cache invalidation message:', error);
            channel.nack(msg, false, true); // Reject the message and do not requeue
        }
    });

    connection.on('close', () => {
        console.error('❌ Blog cache invalidation consumer connection closed unexpectedly');
    });
};
