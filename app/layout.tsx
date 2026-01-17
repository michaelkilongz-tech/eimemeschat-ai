import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../components/providers/AuthProvider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EimemesChat AI - DeepSeek Inspired AI Assistant',
  description: 'An AI chatbot powered by Groq with DeepSeek-like interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10a37f',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
