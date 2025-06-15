'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
    const timer = setTimeout(() => {
      router.push('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.5 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-6xl font-bold text-white mb-4"
        >
          Happy Father&apos;s Day Papi!
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-2xl text-white"
        >
          A special surprise to keep you entertained. Play until the end!👾
          <br />
          <br /> Loading your special surprise...
        </motion.div>
      </motion.div>
    </div>
  );
}
