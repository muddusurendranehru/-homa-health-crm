import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Homa Health Influencer CRM',
  description: 'Dr. Muddu Surendra Nehru MD - Diabetes Reversal Program',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}