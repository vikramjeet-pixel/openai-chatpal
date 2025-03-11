
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Sparkles, Download, Loader2, RefreshCw, Palette, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageGeneratorProps {
  onGenerateImage: (prompt: string, size?: string) => Promise<string | undefined>;
  disabled: boolean;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ 
  onGenerateImage, 
  disabled 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !disabled && !isGenerating) {
      setIsGenerating(true);
      try {
        const imageUrl = await onGenerateImage(prompt, selectedSize);
        if (imageUrl) {
          setGeneratedImageUrl(imageUrl);
        }
      } catch (error) {
        console.error('Error generating image:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleDownload = async () => {
    if (!generatedImageUrl) return;
    
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dalle-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully');
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    }
  };

  const handleRegenerateImage = () => {
    if (prompt.trim() && !disabled && !isGenerating) {
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-b from-primary/5 to-secondary/20 p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <Wand2 className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          AI Image Creator
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create..."
            className={cn(
              "min-h-[100px] resize-none transition-all duration-300 pl-10 pr-4 py-3 border-2 focus-visible:ring-primary/50",
              disabled && "opacity-70"
            )}
            disabled={disabled || isGenerating}
          />
          <Palette className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "text-xs transition-all", 
                selectedSize === '1024x1024' && "bg-primary/10 border-primary/30"
              )}
              onClick={() => setSelectedSize('1024x1024')}
              disabled={disabled || isGenerating}
            >
              Square
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "text-xs transition-all", 
                selectedSize === '1024x1792' && "bg-primary/10 border-primary/30"
              )}
              onClick={() => setSelectedSize('1024x1792')}
              disabled={disabled || isGenerating}
            >
              Portrait
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "text-xs transition-all", 
                selectedSize === '1792x1024' && "bg-primary/10 border-primary/30"
              )}
              onClick={() => setSelectedSize('1792x1024')}
              disabled={disabled || isGenerating}
            >
              Landscape
            </Button>
          </div>

          <Button 
            type="submit" 
            disabled={disabled || isGenerating || !prompt.trim()}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Image
              </>
            )}
          </Button>
        </div>
      </form>

      {generatedImageUrl && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="relative group rounded-lg overflow-hidden border border-border bg-white shadow-md">
            <img 
              src={generatedImageUrl} 
              alt="Generated" 
              className="w-full h-auto object-contain" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/80 hover:bg-white"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/80 hover:bg-white"
                onClick={handleRegenerateImage}
                disabled={isGenerating}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
                Regenerate
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center italic">"{prompt}"</p>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
