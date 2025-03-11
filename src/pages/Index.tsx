
import React, { useState } from 'react';
import ChatContainer from '@/components/ChatContainer';
import ImageGenerator from '@/components/ImageGenerator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/ChatMessage';
import { ChatBubbleIcon, ImageIcon, ChevronRightIcon } from 'lucide-react';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('image');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('openai-api-key') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleGenerateImage = async (prompt: string, size: string = '1024x1024'): Promise<string | undefined> => {
    if (!apiKey) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size,
          quality: 'standard',
          response_format: 'url',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;
      
      // Add to messages for chat history
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content: `Generate image: ${prompt}`,
        timestamp: new Date(),
      };

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Here is the image generated based on your prompt:',
        imageUrl,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      
      return imageUrl;
    } catch (error) {
      console.error('Error calling DALL-E API:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate image');
      return undefined;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <header className="py-6 border-b border-border/50">
        <div className="container">
          <h1 className="text-2xl font-bold text-center">
            AI <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Studio</span>
          </h1>
        </div>
      </header>
      
      <div className="container my-6">
        <div className="flex justify-center mb-6">
          <div className="bg-background border border-border rounded-full p-1 flex">
            <Button 
              variant="ghost" 
              className={`rounded-full ${activeTab === 'image' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setActiveTab('image')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Image Creator
            </Button>
            <Button 
              variant="ghost" 
              className={`rounded-full ${activeTab === 'chat' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <ChatBubbleIcon className="h-4 w-4 mr-2" />
              Chat Bot
            </Button>
          </div>
        </div>
      </div>
      
      <main className="flex-1 container flex flex-col">
        {activeTab === 'chat' ? (
          <ChatContainer />
        ) : (
          <div className="max-w-2xl mx-auto w-full">
            <ImageGenerator 
              onGenerateImage={handleGenerateImage} 
              disabled={isGenerating || !apiKey}
            />
            {messages.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2 text-primary" />
                    Recent Generations
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground"
                    onClick={() => setActiveTab('chat')}
                  >
                    View all in chat
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {messages.filter(m => m.imageUrl).slice(-4).map((message) => (
                    <div 
                      key={message.id} 
                      className="border border-border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={message.imageUrl} 
                        alt="Generated" 
                        className="w-full aspect-square object-cover" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>Powered by OpenAI API (GPT-4 and DALL-E)</p>
      </footer>
    </div>
  );
};

export default Index;
