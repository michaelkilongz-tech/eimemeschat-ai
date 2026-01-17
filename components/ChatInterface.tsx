'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Brain, User, Bot, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { auth } from '@/lib/firebase';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m EimemesChat AI, your DeepSeek-inspired assistant powered by Groq. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get Firebase token for authentication
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();

      // Prepare messages for API
      const apiMessages = [
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: input }
      ];

      // Call our API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: 'mixtral-8x7b-32768',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast.success('AI responded successfully!');
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Check if it's an auth error
      if (error.message.includes('authenticated') || error.message.includes('401')) {
        toast.error('Session expired. Please refresh the page.');
      } else if (error.message.includes('API key')) {
        toast.error('API configuration error. Please contact support.');
      } else if (error.message.includes('Rate limit')) {
        toast.error('Rate limit exceeded. Please try again in a moment.');
      } else {
        toast.error('Failed to get response. Please try again.');
      }
      
      // Fallback to simulated response for demo
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I'm experiencing technical difficulties. This is a fallback response. In production, this would be a real AI response.\n\nYour query was: "${input}"\n\nError: ${error.message}`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" ready for upload`);
      // In real implementation, upload to backend
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: 'Hello! I\'m EimemesChat AI, your DeepSeek-inspired assistant powered by Groq. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
    }]);
    toast.success('Chat cleared');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-deepseek-green to-green-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Groq-Powered AI Assistant
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Using {webSearch ? 'Web Search + ' : ''}Mixtral 8x7B model
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Web Search Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Web Search
              </span>
              <button
                onClick={() => setWebSearch(!webSearch)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors ${webSearch ? 'bg-deepseek-green' : 'bg-gray-300 dark:bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white
                    transition-transform ${webSearch ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            <button 
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Clear Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 bg-gradient-to-br from-deepseek-green/10 to-green-600/10 rounded-2xl mb-6">
              <Brain className="w-12 h-12 text-deepseek-green" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome to EimemesChat AI
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
              Start a conversation by typing your message below. I can help with coding, writing, analysis, and more!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              {['Explain quantum computing', 'Write a React component', 'Plan a startup business', 'Debug this Python code', 'Translate to Spanish', 'Summarize an article'].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : 'bg-deepseek-green/20 dark:bg-green-900/30'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-deepseek-green dark:text-green-400" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 ${message.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`rounded-2xl p-4 max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`mt-2 text-xs text-gray-500 dark:text-gray-400 ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-deepseek-green/20 dark:bg-green-900/30">
                  <Bot className="w-4 h-4 text-deepseek-green dark:text-green-400" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none p-4">
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="small" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {messages[messages.length - 1]?.role === 'user' 
                        ? 'Processing your request...' 
                        : 'Thinking...'
                      }
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Powered by Groq Mixtral 8x7B
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-3xl mx-auto">
          {/* File upload input (hidden) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message EimemesChat AI..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-deepseek-green focus:border-transparent outline-none resize-none min-h-[56px] max-h-40"
              rows={1}
              disabled={isLoading}
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              {/* File Attachment Button */}
              <button
                onClick={handleFileUpload}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`
                  p-2 rounded-lg flex items-center justify-center
                  ${input.trim() && !isLoading 
                    ? 'bg-deepseek-green hover:bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
                  }
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              EimemesChat AI can make mistakes. Consider checking important information.
              {webSearch && ' • Web search is enabled'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
             }
