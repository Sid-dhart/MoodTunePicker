import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onTryAgain: () => void;
}

export default function ErrorState({ onTryAgain }: ErrorStateProps) {
  return (
    <Card className="bg-[#282828] rounded-xl">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-red-900 bg-opacity-30 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500 h-10 w-10" />
          </div>
          <h3 className="font-semibold text-xl mb-2 text-white">Oops! Something went wrong</h3>
          <p className="text-white mb-6">
            We encountered an error while trying to get your recommendations. Please try again later.
          </p>
          
          <Button 
            onClick={onTryAgain} 
            className="bg-[#1DB954] hover:bg-opacity-90 text-white font-medium rounded-lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
