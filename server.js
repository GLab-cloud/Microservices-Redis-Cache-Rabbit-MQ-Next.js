// Sử dụng import thay vì require
import amqp from 'amqplib';

async function start() {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();
        
        console.log("🚀 Kết nối RabbitMQ thành công!");
        
        const queueName = 'test_queue 1';
        await channel.assertQueue(queueName, { durable: false });
        
        channel.sendToQueue(queueName, Buffer.from('Hello từ GitHub Codespaces!'));
        console.log(`📩 Đã gửi tin nhắn vào queue [${queueName}]`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

    } catch (error) {
        console.error("❌ Lỗi kết nối RabbitMQ:", error);
    }
}

start();
