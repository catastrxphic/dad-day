'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
  text: string;
  image?: string;
  delay: number;
}

interface Heart {
  id: number;
  color: string;
  size: number;
  delay: number;
  x: number;
}

const messages: Message[] = [
  {
    text: "Thank you for being the best dad ever Papi",
    image: "/images/memory-1.jpg",
    delay: 0,
  },
  {
    text: "Thank you for all the sacrifices you&apos;ve made for us",
    image: "/images/memory-2.jpg",
    delay: 0,
  },
  {
    text: "Thank you for always being there and fight for us",
    image: "/images/memory-3.jpg",
    delay: 0,
  },
  {
    text: "Thank you for your unconditional love",
    image: "/images/memory-4.jpg",
    delay: 0,
  },
  {
    text: "Thank you for being my hero",
    image: "/images/memory-5.jpg",
    delay: 0,
  },
];

const heartColors = [
  '#ff6b6b', // red
  '#ff9e7d', // coral
  '#ffd93d', // yellow
  '#6c5ce7', // purple
  '#a8e6cf', // mint
  '#ff8b94', // pink
  '#ffd3b6', // peach
  '#a0e7e5', // turquoise
];

export default function CreditsPage() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Shuffle messages and assign random delays
    const shuffled = [...messages]
      .sort(() => Math.random() - 0.5)
      .map((message, index) => ({
        ...message,
        delay: index * 1500 + Math.random() * 1000,
      }));
    
    // Show messages with their assigned delays
    shuffled.forEach((message) => {
      setTimeout(() => {
        setVisibleMessages(prev => [...prev, message]);
      }, message.delay);
    });

    // Generate hearts
    const generateHearts = () => {
      const newHearts: Heart[] = [];
      for (let i = 0; i < 50; i++) {
        newHearts.push({
          id: i,
          color: heartColors[Math.floor(Math.random() * heartColors.length)],
          size: Math.random() * 15 + 8,
          delay: Math.random() * 8,
          x: Math.random() * 90 + 5,
        });
      }
      setHearts(newHearts);
    };

    generateHearts();

    // Add more hearts periodically
    const heartInterval = setInterval(() => {
      const additionalHearts: Heart[] = [];
      for (let i = 0; i < 10; i++) {
        additionalHearts.push({
          id: Date.now() + i,
          color: heartColors[Math.floor(Math.random() * heartColors.length)],
          size: Math.random() * 15 + 8,
          delay: 0,
          x: Math.random() * 90 + 5,
        });
      }
      setHearts(prev => [...prev, ...additionalHearts]);
    }, 2000);

    return () => clearInterval(heartInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 overflow-hidden">
      <AnimatePresence>
        {visibleMessages.map((message, index) => (
          <motion.div
            key={`${message.text}-${index}`}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: '100vh' }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              delay: message.delay / 1000,
            }}
            className="absolute w-64"
            style={{ 
              left: `${(index + 1) * 15}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-lg">
              {message.image && (
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden relative">
                  <Image
                    src={message.image}
                    alt="Memory"
                    fill
                    className="object-cover"
                    onError={() => {
                      console.error(`Failed to load image: ${message.image}`);
                    }}
                  />
                </div>
              )}
              <p className="text-white text-lg font-medium text-center">
                {message.text}
              </p>
            </div>
          </motion.div>
        ))}

        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, y: -100, x: heart.x }}
            animate={{ opacity: 1, y: '100vh', x: heart.x }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 10,
              ease: "easeInOut",
              delay: heart.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 5,
            }}
            className="absolute"
            style={{ left: `${heart.x}%` }}
          >
            <div
              className="relative"
              style={{
                width: heart.size,
                height: heart.size,
              }}
            >
              <div
                className="absolute"
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: heart.color,
                  clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
                  transform: 'scale(1.2)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 12 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50"
      >
        <div className="bg-white rounded-lg p-8 text-center max-w-2xl mx-4">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">Happy Father&apos;s Day!</h2>
          <p className="text-xl text-gray-700">
            Thank you for being the most amazing dad in the whole world, I am extremely grateful and lucky to be your daughter. I love you! ❤️
          </p>
        </div>
      </motion.div>
    </div>
  );
} 