import './globals.css'

export const metadata = {
  title: 'EimemesChat AI',
  description: 'AI Chatbot powered by Groq',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  )
}
