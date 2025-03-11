
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, SparklesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGeneratorProps {
  onGenerateImage: (prompt: string) => void;
  disabled: boolean;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ 
  onGenerateImage, 
  disabled 
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !disabled) {
      onGenerateImage(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h3 className="text-md font-medium">Generate Image with DALL-E</h3>
        </div>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className={cn(
            "min-h-[80px] resize-none transition-all duration-300",
            disabled && "opacity-70"
          )}
          disabled={disabled}
        />
        <Button 
          type="submit" 
          disabled={disabled || !prompt.trim()}
          className="w-full flex items-center gap-2"
        >
          <SparklesIcon className="h-4 w-4" />
          Generate Image
        </Button>
      </form>
    </div>
  );
};

export default ImageGenerator;
