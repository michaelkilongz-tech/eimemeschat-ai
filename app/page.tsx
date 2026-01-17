export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold mb-4 text-deepseek-green">
          EimemesChat AI
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          DeepSeek-inspired AI Chatbot powered by Groq
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We're building an amazing AI chatbot experience inspired by DeepSeek's interface.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🔥 Fast Responses</h3>
              <p className="text-sm">Powered by Groq's lightning-fast inference</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🔒 Secure Login</h3>
              <p className="text-sm">Firebase authentication for your privacy</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎨 Beautiful UI</h3>
              <p className="text-sm">DeepSeek-inspired design and experience</p>
            </div>
          </div>
        </div>
        
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          <p>Check back soon! We're working hard to launch EimemesChat AI.</p>
          <p className="mt-2">Next steps: Firebase setup, Groq API integration, and UI components.</p>
        </div>
      </div>
    </div>
  )
}
