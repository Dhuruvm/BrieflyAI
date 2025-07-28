import { useState, useEffect } from "react";

interface TypingAnimationProps {
  text?: string;
  speed?: number;
  className?: string;
}

export default function TypingAnimation({ 
  text = "...", 
  speed = 500,
  className = "ml-1"
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
        setDisplayText("");
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentIndex, text, speed]);

  return (
    <span className={`animate-typing ${className}`}>
      {displayText}
    </span>
  );
}
