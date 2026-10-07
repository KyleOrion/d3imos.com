import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import Header from './components/Header'
import Providers from './providers'
import { initializeDatabase } from '@/lib/db-init'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'd3imos',
  description: 'Your personal workspace and project hub',
}

// Feelix Brothers Security: Initialize database indexes on startup
// Educational: This runs once when the app starts (Server Component)
// Indexes ensure fast queries and prevent duplicate usernames/emails
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}