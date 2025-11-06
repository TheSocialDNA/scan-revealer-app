import { useState, useEffect } from "react";
import { ProductScanner } from "@/components/ProductScanner";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ScanLine, Sparkles } from "lucide-react";
import { adMobService } from "@/services/admob";
import { Capacitor } from "@capacitor/core";

const Index = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // تهيئة AdMob عند تشغيل التطبيق
    if (Capacitor.isNativePlatform()) {
      adMobService.initialize().then(() => {
        // عرض إعلان بانر في الأسفل
        adMobService.showBanner();
      });
    }

    return () => {
      // إزالة البانر عند إغلاق التطبيق
      if (Capacitor.isNativePlatform()) {
        adMobService.removeBanner();
      }
    };
  }, []);

  const handleAnalysisComplete = (analysisResult: string, image: string) => {
    setAnalysis(analysisResult);
    setImageUrl(image);
  };

  const handleNewScan = () => {
    setAnalysis(null);
    setImageUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary shadow-glow mb-4">
            <ScanLine className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            فاحص المنتجات الذكي
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اكتشف أسرار المنتجات الغذائية والتجميلية بمجرد تصويرها
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {!analysis ? (
            <ProductScanner onAnalysisComplete={handleAnalysisComplete} />
          ) : (
            <AnalysisResults 
              analysis={analysis} 
              imageUrl={imageUrl!} 
              onNewScan={handleNewScan}
            />
          )}
        </main>

        {/* Features */}
        {!analysis && (
          <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔍",
                title: "تحليل دقيق",
                description: "تحليل شامل للمكونات والفوائد والأضرار"
              },
              {
                icon: "⚡",
                title: "نتائج فورية",
                description: "احصل على النتائج خلال ثوان معدودة"
              },
              {
                icon: "🎯",
                title: "نصائح صحية",
                description: "اقتراحات وبدائل صحية أفضل"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-xl shadow-soft border border-primary/10 hover:shadow-glow transition-all"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>مدعوم بتقنية الذكاء الاصطناعي المتقدمة من Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
