
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { LockIcon, UnlockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isKeySet, setIsKeySet] = useState<boolean>(false);

  const handleSaveApiKey = () => {
    if (!apiKey || apiKey.trim() === '') {
      toast.error('Please enter a valid API key');
      return;
    }

    onApiKeyChange(apiKey);
    setIsKeySet(true);
    setShowKey(false);
    toast.success('API key saved');
  };

  const handleReset = () => {
    setApiKey('');
    setIsKeySet(false);
    onApiKeyChange('');
    toast.info('API key removed');
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8 animate-fade-in">
      <div className="mb-2 text-center">
        <h2 className="text-lg font-medium">OpenAI API Key</h2>
        <p className="text-sm text-muted-foreground">
          {isKeySet 
            ? 'Your API key is securely stored in your browser'
            : 'Enter your OpenAI API key to start chatting'}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type={showKey ? 'text' : 'password'}
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={cn(
              "pr-10 transition-all duration-300 border rounded-lg",
              isKeySet ? "bg-muted" : "bg-white"
            )}
            disabled={isKeySet}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? (
              <UnlockIcon className="h-4 w-4" />
            ) : (
              <LockIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {isKeySet ? (
          <Button variant="outline" onClick={handleReset} className="min-w-[80px]">
            Reset
          </Button>
        ) : (
          <Button onClick={handleSaveApiKey} className="min-w-[80px]">
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApiKeyInput;
