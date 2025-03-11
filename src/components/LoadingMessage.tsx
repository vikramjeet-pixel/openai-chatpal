
import React from 'react';
import { BotIcon } from 'lucide-react';

const LoadingMessage: React.FC = () => {
  return (
    <div className="flex py-4 px-5 rounded-xl mb-3 bg-chatbot-assistant border border-chatbot-border animate-fade-up">
      <div className="flex-shrink-0 mr-3">
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <BotIcon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm mb-1">Assistant</div>
        <div className="text-foreground flex items-center">
          <div className="loading-dots flex h-5 items-center text-muted-foreground animate-pulse-subtle">
            Thinking
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
