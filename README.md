# D3IMOS

**Your Personal Workspace & Business Platform**

A modern, secure web application for managing your digital life - built with enterprise-grade security and designed for productivity.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://d3imos.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat&logo=mongodb)](https://www.mongodb.com/)

---

## 🚀 About D3IMOS

**D3IMOS** is a full-stack web application owned and operated by **Kyle Bethke**. It serves as a comprehensive business platform providing:

- 🔐 **Secure Authentication** - Enterprise-grade auth with MFA support
- 📅 **Calendar Integration** - Google Calendar sync and management
- 💼 **Business Tools** - Project management, notes, and productivity features
- 🎨 **Modern UI** - Clean, Apple-inspired design with dark mode
- 🛡️ **Security First** - Built with security best practices from day one

**Live Site**: [d3imos.com](https://d3imos.com)

---

## ✨ Features

### Authentication & Security
- ✅ **Email/Password Registration** with strong password requirements
- ✅ **Google OAuth** integration for seamless login
- ✅ **Two-Factor Authentication (2FA/MFA)** using TOTP
- ✅ **Session Management** with secure JWT tokens (7-day expiry)
- ✅ **Rate Limiting** to prevent brute force attacks (3 attempts/hour)
- ✅ **Audit Logging** for security monitoring and compliance
- ✅ **Encryption at Rest** for sensitive data (AES-256-GCM)

### Security Hardening
- 🔒 **HTTPS Enforcement** with HSTS (2-year max-age)
- 🔒 **Content Security Policy** (CSP) headers
- 🔒 **XSS Protection** (X-Frame-Options, X-Content-Type-Options)
- 🔒 **Secure Password Hashing** (bcrypt with 10 rounds)
- 🔒 **Database Indexes** for performance and uniqueness enforcement
- 🔒 **Environment Variable Encryption** for secrets management

### User Experience
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Material-UI (Joy)** - Beautiful, accessible components
- ⚡ **Fast Performance** - Optimized with Next.js 15 and Vercel Edge
- 🌙 **Dark Mode** - Easy on the eyes during late-night work
- 🔔 **Real-time Updates** - Session persistence across tabs

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Material-UI (Joy)](https://mui.com/joy-ui/)** - Modern component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling

### Backend
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication with JWT sessions
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** - Cloud NoSQL database
- **[Google APIs](https://developers.google.com/calendar)** - Calendar integration
- **[Node.js Crypto](https://nodejs.org/api/crypto.html)** - AES-256-GCM encryption

### DevOps & Infrastructure
- **[Vercel](https://vercel.com/)** - Edge deployment and hosting
- **[GitHub](https://github.com/)** - Version control and CI/CD
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

### Security & Monitoring
- **Rate Limiting** - In-memory IP-based throttling
- **Audit Logging** - Comprehensive event tracking in MongoDB
- **HTTP Security Headers** - CSP, HSTS, X-Frame-Options, etc.
- **Encryption at Rest** - AES-256-GCM for OAuth tokens and MFA secrets

---

## 📦 Quick Start

### Prerequisites

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **pnpm** 8.x or higher (`npm install -g pnpm`)
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas/register))
- **Google Cloud** account ([Console](https://console.cloud.google.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/KyleOrion/d3imos.com.git
cd d3imos.com

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# 4. Generate secrets
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)" >> .env.local

# 5. Start development server
pnpm dev
```

**Development server**: [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?appName=D3IMOS

# Authentication
NEXTAUTH_SECRET=your-secret-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Encryption
ENCRYPTION_KEY=your-encryption-key  # Generate with: openssl rand -hex 32
```

**Note**: Never commit `.env.local` to version control. See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed setup instructions.

---

## 📁 Project Structure

```
d3imos.com/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth.js configuration
│   │   │   └── [...nextauth]/    # OAuth & credential provider
│   │   ├── register/             # User registration endpoint
│   │   ├── mfa/                  # MFA setup & verification
│   │   └── google-calendar/      # Calendar integration
│   ├── auth/                     # Authentication pages
│   │   ├── signin/               # Login page
│   │   └── signup/               # Registration page
│   ├── components/               # React components
│   │   ├── Header.tsx            # Navigation header
│   │   ├── MfaSetup.tsx          # 2FA setup component
│   │   └── ...                   # Other components
│   ├── layout.tsx                # Root layout (database init)
│   └── page.tsx                  # Dashboard home page
├── lib/                          # Utility libraries
│   ├── mongodb.ts                # Database connection
│   ├── user.ts                   # User CRUD operations
│   ├── crypto.ts                 # AES-256-GCM encryption
│   ├── rate-limit.ts             # Rate limiting logic
│   ├── audit-log.ts              # Security event logging
│   ├── db-init.ts                # Database index initialization
│   └── request-context.ts        # IP/User-Agent extraction
├── middleware.ts                 # Next.js middleware (auth protection)
├── next.config.js                # Next.js config (security headers)
├── public/                       # Static assets
│   └── KyleBethke.png           # Profile image
├── DEPLOYMENT.md                 # Production deployment guide
├── CONTRIBUTING.md               # Developer contribution guide
├── SECURITY.md                   # Security policy (coming soon)
└── package.json                  # Dependencies and scripts
```

---

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start dev server on http://localhost:3000
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking

# Deployment
vercel                # Deploy preview to Vercel
vercel --prod         # Deploy to production
vercel logs           # View production logs
```

---

## 🚢 Deployment

D3IMOS is deployed on **Vercel** with automatic deployments from the `main` branch.

### Production Deployment

Every push to `main` triggers automatic deployment:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
# ✅ Automatic deployment to https://d3imos.com
```

### Manual Deployment

```bash
# Deploy to production
vercel --prod

# View deployment logs
vercel logs d3imos.com
```

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

## 🔐 Security

Security is a top priority for D3IMOS. We implement industry best practices:

### Security Measures
- ✅ **Password Hashing**: bcrypt with 10 rounds (~100ms per hash)
- ✅ **Session Security**: Signed JWT tokens with 7-day expiry
- ✅ **HTTPS Enforcement**: HSTS with 2-year max-age
- ✅ **Rate Limiting**: 3 registration attempts per hour per IP
- ✅ **Input Validation**: All user inputs sanitized and validated
- ✅ **Encryption at Rest**: AES-256-GCM for sensitive data
- ✅ **Audit Logging**: All security events logged to MongoDB
- ✅ **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options
- ✅ **MFA Support**: TOTP-based two-factor authentication

### Security Score
**Grade: A+** (up from D- after security hardening)

### Reporting Vulnerabilities

If you discover a security vulnerability:
1. **DO NOT** create a public GitHub issue
2. Email: **security@d3imos.com** (or kyle@d3imos.com)
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We take security seriously and will respond within 48 hours.

---

## 🤝 Contributing

Contributions are welcome! Please read our **[CONTRIBUTING.md](./CONTRIBUTING.md)** guide before submitting PRs.

### Quick Contribution Guide

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- TypeScript strict mode (no `any` types)
- ESLint + Prettier for code style
- Conventional Commits for commit messages
- Security-first development

---

## 📊 Roadmap

### ✅ Completed
- [x] Secure authentication (email/password + Google OAuth)
- [x] Two-factor authentication (TOTP/MFA)
- [x] Rate limiting and security hardening
- [x] Audit logging system
- [x] Google Calendar integration
- [x] Encryption at rest for sensitive data
- [x] Production deployment on Vercel
- [x] Comprehensive documentation (DEPLOYMENT.md, CONTRIBUTING.md)

### 🚧 In Progress
- [ ] User dashboard with analytics
- [ ] Project management features
- [ ] Note-taking system
- [ ] File upload and storage

### 🔮 Planned
- [ ] Team collaboration features
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Webhook support
- [ ] Admin panel for user management

---

## 📈 Performance

### Metrics
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.0s
- **Total Bundle Size**: <200KB (gzipped)

### Optimizations
- ✅ Next.js Server Components for zero client-side JS
- ✅ Vercel Edge Network for global CDN
- ✅ Image optimization with Next.js Image component
- ✅ Database connection pooling
- ✅ Efficient MongoDB indexes

---

## 📖 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment and operations guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Developer contribution guide
- **[Next.js Docs](https://nextjs.org/docs)** - Next.js framework documentation
- **[NextAuth.js Docs](https://next-auth.js.org/)** - Authentication library docs
- **[MongoDB Docs](https://docs.mongodb.com/)** - Database documentation

---

## 🎓 Learning Journey

This project represents my journey into full-stack web development. Key learnings:

- **Security First**: Built with enterprise-grade security from day one
- **Modern Stack**: Next.js 15, React 19, TypeScript, MongoDB
- **Best Practices**: Code quality, documentation, version control
- **Production Ready**: Deployed on Vercel with CI/CD
- **Full Stack**: Frontend, backend, database, deployment, monitoring

**Proudest Achievement**: Took security from **Grade D-** to **Grade A+** through systematic hardening:
1. Credential rotation after exposure
2. HTTP security headers (CSP, HSTS, XSS protection)
3. Encryption at rest (AES-256-GCM)
4. Rate limiting (IP-based throttling)
5. Audit logging (comprehensive event tracking)
6. Database indexes (performance + uniqueness)

---

## 📄 License

**MIT License** - Copyright © 2026 Kyle Bethke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

See [LICENSE](./LICENSE) for full details.

---

## 🙋‍♂️ About the Owner

**Kyle Bethke** - Founder & Developer of D3IMOS

- 🌐 Website: [d3imos.com](https://d3imos.com)
- 💼 LinkedIn: [linkedin.com/in/kylebethke](https://linkedin.com/in/kylebethke)
- 🐙 GitHub: [@KyleOrion](https://github.com/KyleOrion)
- 📧 Email: kyle@d3imos.com

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- [Next.js](https://nextjs.org/) by Vercel
- [React](https://react.dev/) by Meta
- [NextAuth.js](https://next-auth.js.org/) by Balázs Orbán
- [MongoDB](https://www.mongodb.com/) by MongoDB Inc.
- [Material-UI](https://mui.com/) by MUI
- [TypeScript](https://www.typescriptlang.org/) by Microsoft

Special thanks to the open-source community for making this possible! 🎉

---

<div align="center">

**Built with ❤️ by Kyle Bethke**

[🌐 Visit D3IMOS](https://d3imos.com) • [📖 Documentation](./DEPLOYMENT.md) • [🤝 Contribute](./CONTRIBUTING.md)

</div>
