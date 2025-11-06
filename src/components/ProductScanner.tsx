import { useState } from "react";
import { Camera, Upload, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductScannerProps {
  onAnalysisComplete: (analysis: string, imageUrl: string) => void;
}

export const ProductScanner = ({ onAnalysisComplete }: ProductScannerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار صورة صالحة");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setIsLoading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setPreview(base64Image);

        try {
          const { data, error } = await supabase.functions.invoke("analyze-product", {
            body: { imageData: base64Image },
          });

          if (error) throw error;

          if (data.error) {
            toast.error(data.error);
            setIsLoading(false);
            return;
          }

          toast.success("تم تحليل المنتج بنجاح!");
          onAnalysisComplete(data.analysis, base64Image);
        } catch (error) {
          console.error("Error analyzing image:", error);
          toast.error("حدث خطأ أثناء تحليل المنتج");
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("حدث خطأ أثناء معالجة الصورة");
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  return (
    <Card className="p-8 bg-card shadow-soft border-primary/10 transition-all hover:shadow-glow">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">افحص منتجك الآن</h2>
          <p className="text-muted-foreground">قم بتصوير المنتج أو رفع صورة له للحصول على تحليل شامل</p>
        </div>

        {preview && (
          <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
            <img src={preview} alt="Product preview" className="w-full h-48 object-cover" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              id="camera-input"
              disabled={isLoading}
            />
            <label htmlFor="camera-input" className="block">
              <Button
                variant="default"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft"
                disabled={isLoading}
                asChild
              >
                <span>
                  <Camera className="ml-2 h-5 w-5" />
                  التقط صورة
                </span>
              </Button>
            </label>
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
              disabled={isLoading}
            />
            <label htmlFor="file-input" className="block">
              <Button
                variant="outline"
                className="w-full border-primary/30 hover:bg-primary/5 transition-colors"
                disabled={isLoading}
                asChild
              >
                <span>
                  <Upload className="ml-2 h-5 w-5" />
                  رفع صورة
                </span>
              </Button>
            </label>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">جاري تحليل المنتج...</p>
          </div>
        )}
      </div>
    </Card>
  );
};
