# Collaborative Notes API

A robust, scalable Node.js backend service for collaborative note management, featuring real-time sharing capabilities, comprehensive authentication, and intelligent search functionality.

## Overview

The Collaborative Notes API provides a complete backend solution for managing collaborative documents with enterprise-grade security and performance. Built with Node.js and Express.js, it offers seamless integration with modern frontend applications while maintaining high availability and data consistency through MongoDB.

## Key Features

### Authentication & Security
- JWT-based authentication system with secure token management
- Bcrypt password hashing for enhanced security
- Role-based access control for shared resources

### Note Management
- Full CRUD operations with optimized database queries
- Advanced search capabilities across titles and tags
- Flexible visibility controls (public/private)
- Real-time collaborative sharing with granular permissions

### Data Management
- Robust input validation using Joi schemas
- Centralized error handling and logging
- RESTful API design following industry standards
- Optimized database indexing for improved performance

### User Experience
- Email-based user discovery for seamless sharing
- Smart notification system for shared content updates
- Comprehensive filtering and sorting options

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js (v18+) | Server-side JavaScript execution |
| **Framework** | Express.js | Web application framework |
| **Database** | MongoDB + Mongoose | Document storage and ODM |
| **Authentication** | JWT + bcryptjs | Secure user authentication |
| **Validation** | Joi | Request/response validation |
| **Development** | Nodemon | Hot reloading during development |

## Quick Start

### Prerequisites

Ensure you have the following installed:
- Node.js v18.0.0 or higher
- npm v8.0.0 or higher
- MongoDB v5.0 or higher (local or cloud instance)

### Installation

1. **Clone and navigate to the backend directory**
   ```bash
   cd notes-app_v2/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following environment variables in `.env`:
   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development
   
   # Database
   DATABASE_URI=mongodb://localhost:27017/collaborative_notes
   
   # Authentication
   JWT_SECRET=xq3wl6T1vGzB3ZDZx9M9LePQdGXLQpuaPoOjGjTUMmo
   JWT_EXPIRES_IN=7d
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The API server will be available at `http://localhost:8000`

### Production Deployment

For production environments:

```bash
# Install production dependencies only
npm ci --only=production

# Start the production server
npm start
```

## Docker Deployment

### Standalone Container

```bash
# Build the image
docker build -t notes-app_backend:latest .

# Run the container
docker run -d \
  --name notes-api \
  -p 8000:8000 \
  -e DATABASE_URI=mongodb://mongo:27017/notes_db \
  -e JWT_SECRET=xq3wl6T1vGzB3ZDZx9M9LePQdGXLQpuaPoOjGjTUMmo \
  collaborative-notes-api:latest
```

### Docker Compose

The application includes a complete Docker Compose configuration. From the project root:

```bash
# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User authentication |

### Note Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | List user notes with filtering |
| POST | `/api/notes` | Create new note |
| GET | `/api/notes/:id` | Retrieve specific note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Sharing & Collaboration

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notes/:id/share` | Share note with users |
| GET | `/api/users/search` | Find users by email |

### Search & Filtering

Query parameters for `/api/notes`:
- `search`: Search in title and tags
- `visibility`: Filter by public/private
- `tag`: Filter by specific tags
- `sort`: Sort by date, title, or relevance

## Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Production start
npm start

# Run tests
npm test

# Code linting
npm run lint

# Code formatting
npm run format
```

### Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database schemas
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── app.js          # Express application setup
├──  nodemon.json             # Test suites
├── Dockerfille             # Docker configuration
└── package.json          # API documentation
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 8000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `DATABASE_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration time | 7d | No |
| `CORS_ORIGIN` | Allowed CORS origins | * | No |

## Performance & Scalability

- **Database Indexing**: Optimized indexes for search and filtering operations
- **Connection Pooling**: Efficient MongoDB connection management
- **Request Validation**: Early validation to reduce processing overhead
- **Error Handling**: Graceful error responses with appropriate HTTP status codes
- **Security Headers**: Implementation of security best practices

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team or create an issue in the project repository.

---

**Built with ❤️ by Zidane Sabir**