import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useCreateScan } from "@/hooks/use-scan";
import { AppLayout } from "@/components/layout/app-layout";
import { Button, Card } from "@/components/ui/core";
import { Camera, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";

export default function Scan() {
  const [, setLocation] = useLocation();
  const { mutateAsync: createScan, isPending } = useCreateScan();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !isDemo) return;
    
    try {
      // Create a dummy file if in pure demo mode without a file
      const uploadFile = file || new File([""], "demo.jpg", { type: "image/jpeg" });
      const result = await createScan({ file: uploadFile, isDemo });
      setLocation(`/result/${result.id}`);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    }
  };

  return (
    <AppLayout>
      <div className="px-6 py-8 min-h-full flex flex-col">
        <header className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold mb-2">Scan Your Fit</h1>
          <p className="text-muted-foreground font-body text-sm">Upload a full-body photo for AI analysis.</p>
        </header>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
          {!preview ? (
            <Card className="aspect-[3/4] flex flex-col items-center justify-center p-8 border-dashed border-muted-foreground/30 hover:border-foreground transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="font-display uppercase tracking-widest font-bold mb-2">Tap to Capture</h3>
              <p className="text-xs text-muted-foreground text-center">JPEG, PNG, WEBP up to 10MB</p>
              
              <div className="mt-8 flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ImageIcon className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold">Or select from gallery</span>
              </div>
            </Card>
          ) : (
            <div className="relative aspect-[3/4] border-2 border-border p-2">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white w-8 h-8 flex items-center justify-center rounded-none font-bold text-xs"
              >
                X
              </button>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="mt-8 space-y-6">
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-border">
              <input 
                type="checkbox" 
                checked={isDemo} 
                onChange={(e) => setIsDemo(e.target.checked)}
                className="w-5 h-5 accent-gold bg-transparent border-2 border-border rounded-none"
              />
              <div className="flex flex-col">
                <span className="font-display uppercase tracking-wider font-bold text-sm">Demo Mode</span>
                <span className="text-xs text-muted-foreground font-body">Bypass rate limits with sample data</span>
              </div>
            </label>

            <Button 
              className="w-full h-14 text-lg" 
              variant="gold"
              disabled={(!file && !isDemo) || isPending}
              onClick={handleAnalyze}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Analyzing Drip...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  Execute Scan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
