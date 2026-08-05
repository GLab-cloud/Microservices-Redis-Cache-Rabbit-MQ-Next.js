import amqp from 'amqplib';
let channel;
export const connectToRabbitMQ = async () => {
    if (channel) {
        return channel;
    }
    try {
        const connection = await amqp.connect({ protocol: 'amqp', hostname: 'localhost', port: 5672, username: process.env.RABBITMQ_USERNAME, password: process.env.RABBITMQ_PASSWORD });
        channel = await connection.createChannel();
        console.log("🚀 RabbitMQ connected!");
        return channel;
    }
    catch (error) {
        console.error("❌ Error connecting to RabbitMQ:", error);
        throw error;
    }
};
export const publishToQueue = async (queueName, message) => {
    if (!channel) {
        console.error("RabbitMQ channel not initialized");
        return;
    }
    await channel.assertQueue(queueName, { durable: false });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`📩 Message sent to queue [${queueName}]`);
};
export const invalidateCacheJob = async (cacheKeys) => {
    try {
        const message = {
            action: 'invalidate_cache',
            keys: cacheKeys,
        };
        await publishToQueue('cache-invalidation', message);
        console.log(`✅ Invalidate cache job published to RabbitMQ for keys: ${cacheKeys.join(', ')}`);
    }
    catch (error) {
        console.error("❌ Error publishing invalidate cache job:", error);
    }
};
