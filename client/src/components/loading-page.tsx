import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import brieflyLogo from "@assets/briefly-logo.png";

export default function LoadingPage() {
  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <img 
              src={brieflyLogo} 
              alt="Brevia AI" 
              className="h-24 w-auto mx-auto drop-shadow-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Brevia</h1>
          <p className="text-muted-foreground text-sm font-medium">
            AI-Powered Research Assistant
          </p>
        </motion.div>
        
        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          {/* ChatGPT-style thinking dots */}
          <div className="flex justify-center items-center space-x-1 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          </div>
          
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-muted-foreground text-sm"
          >
            Initializing AI models...
          </motion.p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ duration: 2, delay: 0.6 }}
          className="w-full bg-muted rounded-full h-1 mb-8"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.8 }}
            className="bg-primary h-1 rounded-full"
          />
        </motion.div>

        {/* Subtle Feature Hints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Brain className="h-3 w-3" />
            <span>Advanced AI Processing</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Intelligent Note Generation</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}