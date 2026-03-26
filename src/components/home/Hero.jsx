'use client';
import { useEffect, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Hero({ userData }) {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Full Stack Developer';

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    
    return () => clearInterval(typing);
  }, []);

  return (
    <section id="home" className="min-h-screen p-12 flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-500">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 dark:opacity-20"></div>
        {/* Animated Blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 z-10 text-center relative">
        <div className="relative inline-block mb-8 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <Image
            src={userData?.profileImage || '/default-avatar.png'}
            alt="Profile"
            width={170}
            height={170}
            className="relative mt-2 w-56 h-56 rounded-full border-4 border-white dark:border-gray-800 mx-auto object-cover shadow-2xl"
          />
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 animate-pulse"></div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-fade-in">
          {userData?.name || 'John Doe'}
        </h1>

        {/* Location Information */}
        <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 animate-slide-up">
            <MapPin size={20} className="text-primary-500" />
            <span>{userData?.location || 'Poland'}</span>
        </div>

        <div className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-8 h-10 font-light">
          I am a <span className="font-bold text-primary-600 dark:text-primary-400">{typedText}</span>
          <span className="animate-pulse text-primary-500">|</span>
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {userData?.bio || 'Creating amazing web experiences with modern technologies and pixel-perfect design.'}
        </p>

        <div className="flex justify-center space-x-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="#contact"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-40 h-50 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Hire Me
          </a>
          <a
            href="#projects"
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 w-40 h-50 rounded-full font-semibold transition-all transform hover:scale-105 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            View Work
          </a>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}