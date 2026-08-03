import amqp from 'amqplib';

async function start() {
    try {
        const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
        const channel = await connection.createChannel();
        
        console.log("🚀 RabbitMQ connected!");
        
        const queueName = 'test_queue 1';
        await channel.assertQueue(queueName, { durable: false });
        
        channel.sendToQueue(queueName, Buffer.from('Hello from GitHub Codespaces!'));
        console.log(`📩 Message sent to queue [${queueName}]`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

    } catch (error) {
        console.error("❌ Error connecting to RabbitMQ:", error);
    }
}

start();
