import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { Progress } from '@/components/ui/progress';

interface AnalysisResult {
  is_spam: boolean;
  spam_probability: number;
  classification: string;
  recommendation: string;
}

const SMSAnalyzer = () => {
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Ujumbe Mtupu",
        description: "Tafadhali andika ujumbe wa kutathmini",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisResult = await api.detectSMS(message);
      setResult(analysisResult);
      
      toast({
        title: "Uchambuzi Umekamilika",
        description: `Ujumbe umechambuliwa kama ${analysisResult.is_spam ? 'Spam' : 'Halali'}`,
        variant: analysisResult.is_spam ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Error analyzing message:", error);
      toast({
        title: "Uchambuzi Umeshindikana",
        description: "Imeshindikana kuchambua ujumbe. Tafadhali jaribu tena.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kichambua Ujumbe wa Spam</CardTitle>
        <CardDescription>
          Chambua ujumbe wa SMS kutambua spam au ulaghai
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-2 text-sm text-amber-600 font-medium">
          Andika ujumbe wako kwa Kiswahili ili kupata matokeo sahihi
        </div>
        <Textarea
          placeholder="Andika ujumbe wa SMS kuchambua..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px]"
        />
        
        {result && (
          <div className="space-y-4 mt-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Matokeo ya Uchambuzi</h3>
              <Badge 
                variant={result.is_spam ? "destructive" : "default"}
                className="flex items-center"
              >
                {result.is_spam ? (
                  <AlertCircle className="mr-1 h-3 w-3" />
                ) : (
                  <CheckCircle className="mr-1 h-3 w-3" />
                )}
                {result.is_spam ? "Spam" : "Halali"}
              </Badge>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Uwezekano wa Spam</span>
                <span>{Math.round(result.spam_probability * 100)}%</span>
              </div>
              <Progress 
                value={result.spam_probability * 100} 
                className={result.is_spam ? "bg-red-200" : "bg-green-200"}
              />
            </div>
            
            <div className="text-sm mt-2">
              <p className="font-medium mb-1">Ushauri:</p>
              <p className="text-muted-foreground">{result.recommendation}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={analyzeMessage} 
          disabled={isAnalyzing || !message.trim()}
          className="w-full"
        >
          {isAnalyzing ? (
            "Inachambua..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Chambua Ujumbe
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SMSAnalyzer;
