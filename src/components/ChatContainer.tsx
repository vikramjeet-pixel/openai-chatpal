
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage, { Message } from './ChatMessage';
import ChatInput from './ChatInput';
import ApiKeyInput from './ApiKeyInput';
import LoadingMessage from './LoadingMessage';
import ImageGenerator from './ImageGenerator';
import { Button } from "@/components/ui/button";
import { Trash2Icon } from 'lucide-react';

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage on initial render
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('openai-api-key', key);
    } else {
      localStorage.removeItem('openai-api-key');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!apiKey) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Using the latest model, you can change to a different one
          messages: [
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get a response');
      
      // Add a friendly error message
      setMessages(prev => [
        ...prev, 
        {
          id: uuidv4(),
          role: 'assistant',
          content: `I'm sorry, there was an error processing your request. ${error instanceof Error ? error.message : 'Please try again later.'}`,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (prompt: string) => {
    if (!apiKey) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: `Generate image: ${prompt}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

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
          size: '1024x1024',
          quality: 'standard',
          response_format: 'url',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Here is the image generated based on your prompt:',
        imageUrl: data.data[0].url,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling DALL-E API:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate image');
      
      // Add a friendly error message
      setMessages(prev => [
        ...prev, 
        {
          id: uuidv4(),
          role: 'assistant',
          content: `I'm sorry, there was an error generating the image. ${error instanceof Error ? error.message : 'Please try again later.'}`,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    toast.info('Conversation cleared');
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto px-4 py-6">
      <header className="text-center mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">AI Assistant</h1>
        <p className="text-muted-foreground">
          Ask me anything or generate images with DALL-E
        </p>
      </header>

      <ApiKeyInput onApiKeyChange={handleApiKeyChange} />

      {apiKey && (
        <ImageGenerator 
          onGenerateImage={handleGenerateImage} 
          disabled={isLoading}
        />
      )}

      {hasMessages && (
        <div className="flex justify-end mb-4 animate-fade-in">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearConversation}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Clear conversation
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground animate-fade-in">
              <p>No messages yet. Start a conversation or generate an image!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message, index) => (
              <ChatMessage key={message.id} message={message} index={index} />
            ))}
            {isLoading && <LoadingMessage />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading || !apiKey}
        placeholder={apiKey ? "Type your message..." : "Set your API key to start chatting..."}
      />
    </div>
  );
};

export default ChatContainer;
