import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AnalysisResultsProps {
  analysis: string;
  imageUrl: string;
  onNewScan: () => void;
}

export const AnalysisResults = ({ analysis, imageUrl, onNewScan }: AnalysisResultsProps) => {
  // Parse the analysis to extract key information
  const sections = analysis.split("\n\n").filter(section => section.trim());
  
  const getRatingColor = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("ممتاز") || lowerText.includes("جيد جداً")) return "bg-primary text-primary-foreground";
    if (lowerText.includes("جيد")) return "bg-primary-light text-primary-foreground";
    if (lowerText.includes("متوسط")) return "bg-warning text-warning-foreground";
    if (lowerText.includes("سيء") || lowerText.includes("ضار")) return "bg-destructive text-destructive-foreground";
    return "bg-muted text-muted-foreground";
  };

  const getSectionIcon = (section: string) => {
    const lowerSection = section.toLowerCase();
    if (lowerSection.includes("تحذير") || lowerSection.includes("مخاطر") || lowerSection.includes("ضار")) {
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    }
    if (lowerSection.includes("فوائد") || lowerSection.includes("ممتاز")) {
      return <CheckCircle className="h-5 w-5 text-primary" />;
    }
    return <Info className="h-5 w-5 text-accent" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card className="overflow-hidden shadow-soft border-primary/10">
        <div className="relative h-56 bg-gradient-hero">
          <img 
            src={imageUrl} 
            alt="Analyzed product" 
            className="w-full h-full object-contain p-4"
          />
        </div>
      </Card>

      <Card className="p-6 space-y-6 bg-card shadow-soft border-primary/10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">نتائج التحليل</h2>
          <Button 
            onClick={onNewScan}
            variant="outline"
            className="border-primary/30 hover:bg-primary/5"
          >
            فحص منتج جديد
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-6">
          {sections.map((section, index) => {
            const lines = section.split("\n").filter(line => line.trim());
            const title = lines[0];
            const content = lines.slice(1).join("\n");

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-start gap-3">
                  {getSectionIcon(section)}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                      {title}
                      {title.toLowerCase().includes("تقييم") && (
                        <Badge className={getRatingColor(content)}>
                          {content.split(".")[0]}
                        </Badge>
                      )}
                    </h3>
                    {content && (
                      <div className="text-muted-foreground space-y-1 pr-8 whitespace-pre-line">
                        {content}
                      </div>
                    )}
                  </div>
                </div>
                {index < sections.length - 1 && (
                  <Separator className="bg-border/50" />
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
