import React from 'react';
import { BookOpen, Brain, GraduationCap, Users } from 'lucide-react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
      {/* Floating Elements */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute animate-float-slow opacity-10 ${
            i % 4 === 0 ? 'text-blue-400' : 
            i % 4 === 1 ? 'text-purple-400' : 
            i % 4 === 2 ? 'text-teal-400' : 'text-pink-400'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 20 + 20}px`
          }}
        >
          {i % 4 === 0 ? <BookOpen /> : 
           i % 4 === 1 ? <Brain /> : 
           i % 4 === 2 ? <GraduationCap /> : <Users />}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}