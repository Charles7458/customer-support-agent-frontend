# Nexus AI - Customer Support Platform

A modern, full-featured customer support platform with an integrated AI chat agent, ticket management, and real-time human support capabilities. Built with React, TypeScript, and Tailwind CSS.

![GitHub](https://img.shields.io/badge/GitHub-Charles7458/customer--support--agent-blue?logo=github)
![React](https://img.shields.io/badge/React-18+-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3+-06b6d4?logo=tailwindcss)

## 📋 Overview

Nexus AI is a customer support platform designed to streamline support workflows through intelligent automation and seamless team collaboration. The platform combines an AI-powered chat agent with traditional ticket management and human support features.

### Key Features

- **💬 AI Chat Agent** - Intelligent conversational AI for handling customer inquiries
- **🎟️ Ticket Management** - Organize, track, and manage support tickets with detailed views
- **🤖 AI-Powered Responses** - Generate suggested responses for tickets using AI
- **👤 User Authentication** - Secure login and session management with cookie-based auth
- **⚙️ Profile Settings** - User preference and account management
- **📱 Responsive Design** - Seamless experience across desktop and mobile devices
- **🌙 Dark Mode Support** - Full dark theme support throughout the application

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **npm** 10 or higher
- A running FastAPI backend at `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Charles7458/customer-support-agent.git
   cd customer-support-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the next available port)

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting (if configured)
npm run lint

# Type checking
npm run type-check
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # Base UI components (Dialog, Button, etc.)
│   ├── Chat/           # Chat-related components
│   └── Tickets/        # Ticket management components
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   └── useAIResponseDialog.ts  # AI response dialog hook
├── pages/              # Page components (routed views)
├── utils/              # Utility functions and helpers
├── styles/             # Global styles and Tailwind config
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point
```

## 🔑 Key Components

### Authentication (`useAuth.tsx`)
Handles user authentication with cookie-based sessions. Connects to `http://localhost:8000/auth` backend endpoint.

```tsx
const { user, isAuthenticated, login, logout, isLoading } = useAuth();
```

### Chat Interface
Real-time chat UI for customer-agent conversations with message history and status indicators.

### Ticket Management
Split-view interface with ticket list and detailed ticket view. Includes:
- Ticket filtering and search
- Status management
- Conversation history
- AI response generation

### AI Response Dialog (`AIResponseDialog.tsx`)
Component for generating AI-powered responses to customer messages. Features:
- System prompt customization
- Customer message input
- Response preview and regeneration
- One-click send functionality

```tsx
<AIResponseDialog 
  isOpen={isOpen} 
  onClose={closeDialog} 
  onSend={handleResponse}
/>
```

## 🔗 Backend Integration

The frontend connects to a FastAPI backend running on `http://localhost:8000`. Key endpoints:

- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout
- `POST /api/generate-response` - Generate AI responses

**Note:** Update the backend URL in relevant hook and component files if running on a different address.

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | UI framework |
| TypeScript | 5.0+ | Type safety |
| Tailwind CSS | 3.3+ | Styling |
| React Router | Latest | Client-side routing |
| Tabler Icons | Latest | Icon library |
| Vite | Latest | Build tool |

## 📦 Installation & Setup

### Node.js & npm

Ensure you have Node.js 20+ installed:

```bash
node --version  # Should be v20.x.x or higher
npm --version   # Should be 10.x.x or higher
```

Install dependencies:
```bash
npm install
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment**
   - Set `VITE_API_URL` in Vercel project settings if needed
   - Click "Deploy"

4. **Automatic Deployments**
   - Every push to `main` will automatically deploy to production
   - Pull requests get automatic preview deployments

### Vercel Configuration

Vercel should automatically detect this as a Vite project. No additional configuration is needed, but you can create a `vercel.json` file for custom settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

## 🎨 Styling

The project uses **Tailwind CSS** for styling with a custom design system. Key color utilities:

- **Primary**: `bg-[#0058be]` (Blue)
- **Success**: `bg-[#10b981]` (Green)
- **Danger**: `bg-[#ba1a1a]` (Red)
- **Warning**: `bg-[#f59e0b]` (Amber)

Dark mode is fully supported with `dark:` prefixes throughout components.

## 🔐 Security

- **Cookie-based Authentication** - Secure session management with HTTP-only cookies
- **CORS Support** - Configured for cross-origin requests with credentials
- **Environment Variables** - Sensitive data can be stored in `.env.local`

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Common Issues & Solutions

### Page Reload Issues
If full page reloads occur when navigating:
- Ensure you're using React Router's `navigate()` or `<Link>` instead of native `href`
- Check route order in Router configuration (more specific routes first)

### Mobile Dialog Issues
If dialogs appear off-screen on mobile:
- Verify viewport meta tag is present: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Check that Dialog component doesn't have fixed width constraints

### Backend Connection Errors
- Ensure FastAPI backend is running on `http://localhost:8000`
- Check that `credentials: 'include'` is set on all fetch requests
- Verify CORS is configured properly on the backend

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [Vercel Deployment Guide](https://vercel.com/docs)

## 📝 License

This project is part of the Nexus AI customer support platform.

## 📧 Support

For issues or questions, please create an issue in the [GitHub repository](https://github.com/Charles7458/customer-support-agent/issues).

---

**Built with ❤️ for modern customer support**
