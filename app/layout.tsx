import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Ruin Machine | Interactive Gambling Math Simulator',
  description: 'Interactive web simulator proving why gambling always loses. Try Martingale, Flat Bet, and more strategies - all fail against probability theory!',
  keywords: 'gambling simulator, probability theory, martingale strategy, house edge, gamblers ruin',
  openGraph: {
    title: 'The Ruin Machine',
    description: 'A Mathematical Proof That Gambling Always Loses',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
