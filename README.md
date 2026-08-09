# Microservices Redis Cache RabbitMQ Next.js

A modern, scalable microservices architecture built with Node.js, Express, TypeScript, and leveraging Redis caching with RabbitMQ message queuing for asynchronous communication.

## 📋 Project Overview

This repository implements a distributed microservices system designed to handle blog management, user authentication, and author management with a focus on performance through caching and reliable message queuing.

**Technology Stack:**
- **Runtime**: Node.js with ES Modules
- **Language**: TypeScript
- **Framework**: Express.js
- **Message Queue**: RabbitMQ (AMQP)
- **Caching**: Redis
- **Database**: Neon PostgreSQL (Serverless) & MongoDB
- **Cloud Storage**: Cloudinary
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Generative AI

## 🏗️ Architecture

### Service Structure

```
services/
├── author/      # Author management service
├── blog/        # Blog content service with Redis caching
└── user/        # User management service
```

### Core Services

#### 1. **Author Service**
- Handles author profile management
- Integrates with Cloudinary for image uploads
- Uses Neon PostgreSQL for persistence
- Connects to RabbitMQ for event publishing
- Built with Express.js and TypeScript

**Port**: Configurable via `PORT` environment variable

**Key Features:**
- JWT authentication
- File upload handling with Multer
- CORS support for cross-origin requests
- Google Generative AI integration

#### 2. **Blog Service**
- Manages blog posts and content
- **Redis Caching**: Implements distributed cache invalidation
- Consumer pattern for handling cache invalidation messages from RabbitMQ
- Full CRUD operations for blog management
- Comments and saved blogs functionality

**Port**: 5002 (default)

**Features:**
- Cached blog retrieval for improved performance
- Comment management
- Blog bookmarking functionality
- RabbitMQ consumer for cache synchronization

#### 3. **User Service**
- User profile and authentication management
- User-related operations and data storage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- RabbitMQ server running (default: `localhost:5672`)
- Redis instance running
- Neon PostgreSQL account for serverless database
- MongoDB instance (local or cloud)
- Cloudinary account for image hosting
- Google API credentials for AI services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GLab-cloud/Microservices-Redis-Cache-Rabbit-MQ-Next.js.git
   cd Microservices-Redis-Cache-Rabbit-MQ-Next.js
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install service-specific dependencies**
   ```bash
   cd services/author && npm install
   cd ../blog && npm install
   cd ../user && npm install
   ```

### Configuration

Create `.env` files in each service directory:

**Root `.env`:**
```env
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=admin123
```

**services/author/.env:**
```env
PORT=5001
Cloud_Name=<your_cloudinary_name>
Cloud_Api_Key=<your_cloudinary_api_key>
Cloud_Api_Secret=<your_cloudinary_api_secret>
DATABASE_URL=<your_neon_postgresql_url>
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
GOOGLE_API_KEY=<your_google_api_key>
```

**services/blog/.env:**
```env
PORT=5002
REDIS_REST_URL=<your_redis_url>
JWT_SECRET=<your_jwt_secret>
DATABASE_URL=<your_neon_postgresql_url>
MONGODB_URI=<your_mongodb_connection_string>
GOOGLE_API_KEY=<your_google_api_key>
```

**services/user/.env:**
```env
PORT=5003
DATABASE_URL=<your_neon_postgresql_url>
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

### Running the Services

#### Development Mode

**Start RabbitMQ Message Queue:**
```bash
npm start
```

**Start Author Service:**
```bash
cd services/author
npm run dev
```

**Start Blog Service:**
```bash
cd services/blog
npm run dev
```

**Start User Service:**
```bash
cd services/user
npm run dev
```

#### Production Mode

Each service can be built and started:
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Author Service (`/api/v1`)
- Blog management routes
- Author profile endpoints
- Image upload handling

### Blog Service (`/api/v1`)
- Retrieve blogs with Redis caching
- Create/update/delete blog posts
- Comment management
- Save/bookmark blogs

### User Service
- User registration and authentication
- Profile management
- User operations

## 💾 Database Schema

### PostgreSQL (Neon)

#### Blog Service Tables
- `blogs` - Blog post content and metadata
- `comments` - User comments on blogs
- `savedblogs` - Bookmarked blogs by users

#### Author Service Tables
- Author profile information
- Related blog data

#### User Service Tables
- User credentials and profiles
- User metadata

### MongoDB Collections

MongoDB serves as an additional data store for flexible schema operations and document-based persistence.

#### Installation & Setup

**Local MongoDB:**
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Or use Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

**MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

#### Connection Configuration

**Node.js/Express Setup:**
```javascript
import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectMongoDB;
```

#### MongoDB Schema Examples

**User Schema (MongoDB):**
```javascript
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  username: String,
  password: { type: String, required: true },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
  },
  role: { type: String, default: 'user' },
  preferences: {
    notifications: Boolean,
    theme: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
```

**Blog Schema (MongoDB):**
```javascript
const blogSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  tags: [String],
  category: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  metadata: {
    readTime: Number,
    wordCount: Number,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);
```

**Author Schema (MongoDB):**
```javascript
const authorSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: String,
  avatar: String,
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String,
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  followers: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Author = mongoose.model('Author', authorSchema);
```

#### MongoDB CRUD Operations

**Create:**
```javascript
const newBlog = await Blog.create({
  title: 'My First Blog',
  content: 'Blog content here...',
  author: authorId,
  tags: ['tech', 'javascript'],
});
```

**Read:**
```javascript
// Single document
const blog = await Blog.findById(blogId);

// Multiple documents
const blogs = await Blog.find({ status: 'published' });

// With aggregation
const stats = await Blog.aggregate([
  { $match: { author: authorId } },
  { $group: { _id: '$category', count: { $sum: 1 } } },
]);
```

**Update:**
```javascript
const updatedBlog = await Blog.findByIdAndUpdate(
  blogId,
  { 
    title: 'Updated Title',
    updatedAt: new Date(),
  },
  { new: true }
);
```

**Delete:**
```javascript
await Blog.findByIdAndDelete(blogId);
```

**Populate Relations:**
```javascript
const blog = await Blog.findById(blogId).populate('author');
```

#### MongoDB Indexes

```javascript
// Create indexes for performance
userSchema.index({ email: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1, createdAt: -1 });
authorSchema.index({ email: 1 });
```

#### MongoDB Atlas Features

- **Automated Backups**: Daily backups with point-in-time recovery
- **Monitoring**: Real-time performance metrics and analytics
- **Security**: IP whitelisting, encryption at rest, authentication
- **Scaling**: Auto-scaling storage and performance optimization

## 🔄 Message Queue Architecture

### RabbitMQ Implementation

**Queue: `cache_invalidation`**
- Used by blog service for cache synchronization
- Triggers Redis cache invalidation events
- Ensures data consistency across distributed caches

**Main Connection:**
- Supports configurable credentials via environment variables
- Auto-reconnection handling
- Error logging and monitoring

## ⚡ Caching Strategy

The blog service implements a sophisticated caching layer:

1. **Redis Integration**: Caches frequently accessed blog posts
2. **Cache Invalidation**: Uses RabbitMQ consumers to invalidate stale cache
3. **Performance**: Reduces database queries for read-heavy operations
4. **Consistency**: Event-driven cache updates maintain data integrity

## 🔐 Security Features

- **JWT Authentication**: Token-based API authentication
- **CORS Enabled**: Controlled cross-origin access
- **Environment Variables**: Sensitive data management
- **Input Validation**: Multer for file upload validation
- **Google Generative AI**: Secure API integration
- **MongoDB Security**: Connection string encryption, IP whitelisting
- **Database Encryption**: At-rest and in-transit encryption

## 📦 Dependencies

### Core
- `express`: Web framework
- `amqplib`: RabbitMQ client
- `redis`: Cache client
- `@neondatabase/serverless`: PostgreSQL client
- `mongoose`: MongoDB ODM
- `mongodb`: MongoDB native driver

### Development
- `typescript`: Type safety
- `nodemon`: Auto-restart during development
- `concurrently`: Run multiple processes

### Additional
- `jsonwebtoken`: Authentication
- `cloudinary`: Image storage
- `dotenv`: Environment configuration
- `cors`: Cross-origin support
- `@google/generative-ai`: AI services

## 🛠️ Development

### Project Structure
```
.
├── server.js           # RabbitMQ connection test
├── package.json        # Root dependencies
├── services/
│   ├── author/         # Author microservice
│   ├── blog/           # Blog microservice with cache
│   └── user/           # User microservice
└── .devcontainer/      # Development container setup
```

### Build Commands

Each service supports:
```bash
npm run build          # Compile TypeScript
npm run start          # Run compiled code
npm run dev            # Development mode with hot reload
npm test               # Run tests (if configured)
```

## 🐳 Docker & DevContainer

The project includes `.devcontainer` configuration for consistent development environments using GitHub Codespaces or Docker.

## 📊 Performance Optimization

1. **Redis Caching**: Reduces database load for frequently accessed data
2. **Asynchronous Processing**: RabbitMQ enables non-blocking operations
3. **Distributed Architecture**: Independent services can scale separately
4. **Serverless Database**: Neon PostgreSQL scales with demand
5. **MongoDB Indexing**: Optimized queries with proper index strategy
6. **CDN Integration**: Cloudinary for global image distribution

## 🚨 Error Handling

- Comprehensive try-catch blocks in all services
- Console logging for debugging
- Graceful shutdown on connection failures
- Environment variable fallbacks
- MongoDB connection error handling

## 📝 License

ISC License - See package.json for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests to improve the project.

## 📧 Support

For issues, questions, or suggestions, please open an issue in the [GitHub repository](https://github.com/GLab-cloud/Microservices-Redis-Cache-Rabbit-MQ-Next.js/issues).

---

**Repository**: [GLab-cloud/Microservices-Redis-Cache-Rabbit-MQ-Next.js](https://github.com/GLab-cloud/Microservices-Redis-Cache-Rabbit-MQ-Next.js)  
**Language**: TypeScript  
**Created**: 2026  
**Last Updated**: August 9, 2026
