# d3imos - Personal Workspace

Your personal workspace and project hub built with Next.js, React, and Material-UI.

## About

d3imos is a modern, Apple-inspired personal workspace for tracking projects, habits, notes, and more. A clean dashboard for organizing your work and personal life.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI (Joy)** - Component library
- **pnpm** - Package manager

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (install with `npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/KyleOrion/d3imos.com.git
cd d3imos.com

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3005](http://localhost:3005) to view the site.

## Available Scripts

- `pnpm dev` - Start development server on port 3005
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Check TypeScript types

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   └── components/        # React components
├── public/                # Static assets
│   └── KyleBethke.png    # Profile image
└── package.json
```

## Features

- 🏠 Clean, Apple-inspired dashboard
- ✅ Daily habit tracker
- 🔗 Quick links to your favorite sites
- 📝 Project management widgets
- 📱 Responsive design
- 🔐 Full authentication with NextAuth
- ⚡ Fast page loads with Next.js 16

## Deployment

This site can be deployed to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kylebethke.com)

Or deploy manually:

```bash
pnpm build
# Upload the .next folder and run `pnpm start` on your server
```

## Roadmap

- [ ] Add Projects page
- [ ] Add Blog section
- [ ] Add Contact/Links page
- [ ] Add animations
- [ ] Connect to a CMS

## Learning Journey

This portfolio is part of my web development learning journey. I'm building it to:
- Learn Next.js and React
- Practice TypeScript
- Understand modern web development
- Showcase my projects
- Have fun coding!

## License

MIT License - feel free to fork and modify for your own portfolio!

## Contact

- Website: [d3imos.com](https://d3imos.com)
- GitHub: [@KyleOrion](https://github.com/KyleOrion)

---

Built with ❤️ by d3imos
