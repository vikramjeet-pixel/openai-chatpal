
import React from 'react';
import { cn } from '@/lib/utils';
import { UserIcon, BotIcon } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "flex py-4 px-5 rounded-xl mb-3 transition-all",
        "animate-fade-up",
        isUser ? "bg-chatbot-user" : "bg-chatbot-assistant border border-chatbot-border",
        { "animation-delay-100": index > 0 }
      )}
      style={{ 
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both' 
      }}
    >
      <div className="flex-shrink-0 mr-3">
        {isUser ? (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <BotIcon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm mb-1">
          {isUser ? 'You' : 'Assistant'}
        </div>
        <div className="text-foreground whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
