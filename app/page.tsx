'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showInputs, setShowInputs] = useState(false);
  const fullText = "Hi, I'm Grace.";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        setTimeout(() => setShowInputs(true), 800);
        clearInterval(timer);
      }
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start pt-48 gap-16">
      <h1 className="text-4xl font-bold">
        {displayText}
        <motion.span
          animate={isTyping ? {} : { opacity: [1, 0, 1] }}
          transition={{ 
            duration: 1.2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          |
        </motion.span>
      </h1>
      
      <AnimatePresence>
        {showInputs && (
          <motion.div 
            className="flex flex-row gap-4 w-full max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 3, 
              ease: "easeOut"
            }}
          >
            <input
              type="text"
              placeholder="Nice to meet you, who are you?"
              className="flex-1 px-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground text-center"
            />
            <input
              type="text"
              placeholder="What are you working on?"
              className="flex-1 px-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground text-center"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
