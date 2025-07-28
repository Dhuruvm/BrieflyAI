import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import brieflyLogo from "@assets/briefly-logo.png";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-ai-black flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <img 
            src={brieflyLogo} 
            alt="Briefly.AI" 
            className="h-32 w-auto mx-auto drop-shadow-2xl"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-ai-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-ai-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-ai-amber rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          <p className="text-ai-text-secondary text-lg font-medium mb-6">
            Initializing AI...
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              className="border-ai-border hover:border-ai-blue px-6 py-2 rounded-full transition-all duration-300"
            >
              Get Started
            </Button>
            <Button 
              className="bg-ai-blue hover:bg-ai-blue-dark px-6 py-2 rounded-full transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}