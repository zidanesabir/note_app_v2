Collaborative Notes App - Frontend
A modern, responsive web application for collaborative note-taking and sharing built with React.js, Vite, and Tailwind CSS. This frontend provides an intuitive interface for creating, editing, and sharing notes with real-time collaboration features.
🚀 Features
Core Functionality

Secure Authentication: User registration and login with JWT token management
Note Management: Create, edit, delete, and organize notes with full CRUD operations
Real-time Collaboration: Share notes with other users for seamless collaboration
Public Sharing: Generate public access links for selected notes
Advanced Search & Filtering: Find notes quickly with powerful search capabilities
Markdown Support: Rich text editing with Markdown syntax support

User Experience

Responsive Design: Optimized for desktop, tablet, and mobile devices
Modern UI: Clean, intuitive interface with Tailwind CSS styling
Interactive Notifications: Real-time feedback with SweetAlert2 notifications
Notification Center: Bell icon with badge showing shared notes count
Pagination: Efficient navigation through large note collections
Loading States: Smooth user experience with loading indicators

🛠 Technology Stack
CategoryTechnologyFrontend FrameworkReact.js 18+Build ToolViteRoutingReact Router DOMStylingTailwind CSSState ManagementReact Context APIHTTP ClientAxiosUI ComponentsLucide React IconsNotificationsSweetAlert2Markdown RenderingReact Markdown
📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js: Version 18.0.0 or higher (LTS recommended)
npm: Version 8.0.0 or higher (comes with Node.js)
Backend API: Node.js/Express.js backend running on http://localhost:8000

Check your versions:
bashnode --version
npm --version
🚀 Getting Started
Option 1: Local Development Setup

Clone and navigate to the project:
bashgit clone <repository-url>
cd collaborative-notes-app/frontend

Install dependencies:
bashnpm install

Environment configuration:
bash# Copy the environment template
cp .env.example .env.local
Edit .env.local and configure your environment variables:
envVITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Collaborative Notes

Start the development server:
bashnpm run dev
The application will be available at http://localhost:5173

Option 2: Docker Setup

Build the Docker image:
bashdocker build -t collaborative-notes-frontend .

Run the container:
bashdocker run -p 3000:3000 \
  -e VITE_API_BASE_URL=http://host.docker.internal:8000/api \
  collaborative-notes-frontend

Using Docker Compose (Recommended):
From the root project directory:
bashdocker-compose up --build


📁 Project Structure
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── notes/        # Note-related components
│   │   └── shared/       # Shared UI components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   └── App.jsx           # Main application component
├── .env.example          # Environment variables template
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind CSS configuration
🔧 Available Scripts
CommandDescriptionnpm run devStart development server with hot reloadnpm run buildBuild production-ready applicationnpm run previewPreview production build locallynpm run lintRun ESLint for code quality checksnpm run lint:fixFix auto-fixable ESLint issues
🌐 Environment Variables
Create a .env.local file in the root directory with the following variables:
env# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Application Configuration
VITE_APP_NAME=Collaborative Notes
VITE_APP_VERSION=1.0.0

# Feature Flags (optional)
VITE_ENABLE_PUBLIC_SHARING=true
VITE_ENABLE_NOTIFICATIONS=true
🎨 UI/UX Features

Dark/Light Mode: Automatic theme detection with manual override
Keyboard Shortcuts: Quick actions for power users
Accessibility: WCAG 2.1 AA compliant with screen reader support
Performance: Optimized bundle size and lazy loading
Progressive Web App: PWA-ready with offline capabilities

🔐 Security Features

JWT Token Management: Secure authentication with automatic token refresh
Route Protection: Private routes with authentication guards
XSS Protection: Sanitized user inputs and secure rendering
CSRF Protection: Cross-site request forgery prevention

📱 Browser Support

Modern Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
Mobile: iOS Safari 14+, Chrome Mobile 90+
Progressive Enhancement: Graceful degradation for older browsers


🤝 Contributing

Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🆘 Support

Documentation: Project Wiki
Issues: GitHub Issues
Discussions: GitHub Discussions
Email: support@yourproject.com

🙏 Acknowledgments

React.js - The web framework used
Vite - Next generation frontend tooling
Tailwind CSS - Utility-first CSS framework
Lucide - Beautiful & consistent icon toolkit


Made with ❤️ by Zidane Sabir