# FyreBot - Frontend Application

A modern, production-ready Next.js frontend for the multi-tenant FyreBot platform.

## 🚀 Features

- **Modern Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Beautiful UI**: shadcn/ui components with dark mode support
- **State Management**: Zustand for efficient client state
- **Authentication**: JWT-based auth with protected routes
- **Real-time Chat**: Interactive chatbot with message history
- **Data Management**: Full CRUD operations for knowledge base
- **Tenant Dashboard**: Profile management, API keys, usage statistics
- **Responsive Design**: Mobile-first, works on all devices
- **Type Safety**: Full TypeScript coverage
- **Production Ready**: Optimized build, error handling, loading states

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running (see main project README)

## 🛠️ Installation

```bash
# Navigate to frontend directory
cd chatbot-frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update API URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Toaster
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── dashboard/         # Protected dashboard
│       ├── layout.tsx     # Dashboard layout with nav
│       ├── chat/          # Chat interface
│       ├── data/          # Data registry management
│       └── tenant/        # Tenant settings
├── components/
│   ├── ChatBot.tsx        # Main chatbot component
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── api.ts             # API client with axios
│   ├── store.ts           # Zustand state stores
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts           # Utility functions
└── globals.css            # Global styles with Tailwind
```

## 🎨 Key Components

### ChatBot Component
Interactive AI chatbot with:
- Real-time message streaming
- Source citations
- Message history
- Auto-scroll
- Loading states

### Data Registry
Full-featured data management:
- Create, read, update, delete operations
- Search functionality
- Metadata support
- JSON validation

### Tenant Settings
Complete account management:
- Profile updates
- API key display
- Usage statistics with progress bars
- Rate limit information

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token added to all API requests via axios interceptor
4. Protected routes redirect to login if unauthenticated
5. Automatic logout on 401 responses

## 🎯 State Management

### Auth Store (Zustand + Persist)
- User authentication state
- Tenant information
- Token management

### Chat Store
- Chat sessions
- Message history
- Loading states

### Data Store
- Data items
- Pagination
- Search/filter state

## 🔧 API Integration

All API calls are centralized in `lib/api.ts`:

```typescript
// Example usage
import { tenantApi, dataApi, chatApi } from '@/lib/api';

// Login
const response = await tenantApi.login(email, password);

// Register data
const data = await dataApi.register({ title, content });

// Send chat message
const answer = await chatApi.sendMessage(message);
```

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **CSS Variables**: Theme customization
- **Dark Mode**: Built-in support
- **Responsive**: Mobile-first design

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t chatbot-frontend .

# Run container
docker run -p 3001:3000 chatbot-frontend
```

### Environment Variables

Required for production:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 📊 Performance

- **Lighthouse Score**: 95+
- **Bundle Size**: Optimized with tree-shaking
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Next.js Font optimization

## 🧪 Development Tips

### Hot Reload
Changes auto-reload in development mode.

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Build Analysis
```bash
npm run build
# Check .next/analyze for bundle size
```

## 🔒 Security

- XSS protection via React
- CSRF protection
- Secure token storage
- Input validation
- API error handling
- Rate limiting (backend)

## 📝 Pages Overview

### Public Pages
- **/** - Landing page with features and pricing
- **/login** - User authentication
- **/register** - New account creation

### Protected Pages (Dashboard)
- **/dashboard/chat** - AI chatbot interface
- **/dashboard/data** - Knowledge base management
- **/dashboard/tenant** - Account settings

## 🎯 Best Practices

1. **Type Safety**: All props and state are typed
2. **Error Handling**: Try-catch with user-friendly messages
3. **Loading States**: Skeleton screens and spinners
4. **Accessibility**: ARIA labels and keyboard navigation
5. **Code Organization**: Feature-based structure
6. **Performance**: Lazy loading and memoization

## 🐛 Troubleshooting

### API Connection Issues
Check that backend is running and `.env.local` has correct URL.

### Authentication Errors
Clear localStorage and try logging in again.

### Build Errors
Delete `.next` folder and `node_modules`, then reinstall.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand State Management](https://zustand-demo.pmnd.rs)

## 🤝 Contributing

1. Follow existing code style
2. Add TypeScript types for all new code
3. Test on mobile and desktop
4. Update documentation

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ using Next.js, React, and TypeScript
# fyrebot-frontend
