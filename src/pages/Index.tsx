
import React from 'react';
import ChatContainer from '@/components/ChatContainer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <main className="flex-1 container flex flex-col">
        <ChatContainer />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>Powered by OpenAI API (GPT-4 and DALL-E)</p>
      </footer>
    </div>
  );
};

export default Index;
