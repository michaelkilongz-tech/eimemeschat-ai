'use client';

import { useState } from 'react';
import { Plus, Trash2, Clock, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Conversation {
  id: string;
  title: string;
  date: string;
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'How to learn React?', date: '2024-01-15' },
    { id: '2', title: 'Python vs JavaScript', date: '2024-01-14' },
    { id: '3', title: 'AI Future Trends', date: '2024-01-13' },
  ]);

  const createNewChat = () => {
    const newChat: Conversation = {
      id: Date.now().toString(),
      title: `New Chat ${conversations.length + 1}`,
      date: new Date().toISOString().split('T')[0],
    };
    setConversations([newChat, ...conversations]);
    toast.success('New chat created');
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(conversations.filter(conv => conv.id !== id));
    toast.success('Chat deleted');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return dateStr;
    }
  };

  return (
    <aside className={`
      ${collapsed ? 'w-16' : 'w-64'} 
      flex flex-col h-full border-r border-gray-200 dark:border-gray-700 
      bg-white dark:bg-gray-800 transition-all duration-300
    `}>
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-20 p-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={createNewChat}
          className={`
            w-full flex items-center justify-center gap-2 
            bg-deepseek-green hover:bg-green-600 
            text-white font-medium py-3 rounded-xl
            transition-colors ${collapsed ? 'px-0' : 'px-4'}
          `}
        >
          <Plus className="w-5 h-5" />
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3">
        {!collapsed && (
          <div className="mb-4 px-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Clock className="w-4 h-4" />
              <span>Recent Conversations</span>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`
                group flex items-center gap-3 p-3 rounded-xl
                hover:bg-gray-100 dark:hover:bg-gray-700
                cursor-pointer transition-colors
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(conv.date)}
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>EimemesChat AI v1.0</p>
            <p className="mt-1">Powered by Groq & Firebase</p>
          </div>
        </div>
      )}
    </aside>
  );
}
