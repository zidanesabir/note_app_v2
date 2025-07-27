# Collaborative Notes Management Platform

A modern, full-stack web application for collaborative note management with advanced sharing capabilities, real-time search, and intuitive user experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)

## 🚀 Overview

This application provides a comprehensive solution for personal and collaborative note management, featuring secure user authentication, rich content editing with Markdown support, and flexible sharing mechanisms. Built with modern web technologies, it delivers a responsive and intuitive user experience across all devices.

## ✨ Key Features

### Core Functionality
- **Secure Authentication**: JWT-based user registration, login, and session management
- **Rich Note Creation**: Full Markdown support with real-time preview
- **Advanced Organization**: Tag-based categorization and visibility controls
- **Powerful Search**: Full-text search across titles, content, and tags
- **Smart Filtering**: Filter by visibility status (private, shared, public)

### Collaboration Features
- **Selective Sharing**: Share notes with specific users via email
- **Public Links**: Generate public URLs for broader access
- **Real-time Notifications**: Visual indicators for shared content
- **Access Control**: Read-only access for shared notes with clear attribution

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean interface with subtle animations and glassmorphism effects
- **Efficient Navigation**: Pagination for large note collections
- **Interactive Feedback**: SweetAlert2 notifications for user actions

## 🛠 Technology Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database with Mongoose ODM |
| **JWT** | Authentication and authorization |
| **bcryptjs** | Password hashing |
| **Joi** | Data validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React.js** | UI library with hooks |
| **Vite** | Build tool and development server |
| **Tailwind CSS** | Utility-first styling |
| **React Router** | Client-side routing |
| **Axios** | HTTP client |
| **React Markdown** | Markdown rendering |

### DevOps & Tools
- **Docker & Docker Compose**: Containerization and orchestration
- **ESLint & Prettier**: Code quality and formatting
- **Nodemon**: Development auto-reload

## 📁 Project Architecture

```
notes-app_v2/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Authentication & validation
│   │   └── utils/            # Helper functions
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # React.js Client Application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Route components
│   │   ├── context/         # State management
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Client utilities
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # Multi-container orchestration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18+ LTS)
- **Docker** and **Docker Compose** (recommended)
- **Git**

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/zidanesabir/note_app.git
   cd note_app
   ```

2. **Launch the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs

### Option 2: Local Development

<details>
<summary>Click to expand local setup instructions</summary>

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Database Setup
Ensure MongoDB is running locally or update `DATABASE_URI` in your configuration.

</details>

## 📖 Usage Guide

### Getting Started
1. Navigate to http://localhost:3000
2. Create a new account using the registration form
3. Log in with your credentials

### Managing Notes
- **Create**: Use the "Create Note" button to add new notes with Markdown support
- **Organize**: Add tags and set visibility (private, shared, public)
- **Search**: Use the search bar to find notes by title, content, or tags
- **Filter**: Apply visibility filters to organize your view

### Collaboration
- **Share Notes**: Click the share button and enter recipient email addresses
- **View Shared Content**: Check the notification bell for notes shared with you
- **Public Links**: Generate public URLs for notes that don't require authentication

## 🔧 API Reference

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User authentication
GET  /api/auth/me         # Get current user
GET  /api/auth/users      # Search users by email
```

### Notes Endpoints
```
GET    /api/notes         # List user notes (with pagination)
POST   /api/notes         # Create new note
GET    /api/notes/:id     # Get specific note
PUT    /api/notes/:id     # Update note
DELETE /api/notes/:id     # Delete note
POST   /api/notes/:id/share    # Share note with users
GET    /api/notes/public/:id   # Access public note
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new functionality
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or have questions:
1. Check existing [GitHub Issues](https://github.com/zidanesabir/note_app/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

## 🙏 Acknowledgments

Built with modern web technologies and best practices. Special thanks to the open-source community for the excellent tools and libraries that made this project possible.

---

**Made by Zidane Sabir**