import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function LoadingState() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="bg-[#282828] rounded-xl mb-10">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#1DB954] bg-opacity-20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Music className="text-[#1DB954] h-10 w-10" />
          </div>
          <h3 className="font-semibold text-xl mb-2 text-white">Finding your perfect songs...</h3>
          <p className="text-white mb-6">We're searching through millions of tracks to match your preferences</p>
          
          <div className="w-full max-w-md mx-auto">
            <Progress value={progress} className="h-1 bg-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
