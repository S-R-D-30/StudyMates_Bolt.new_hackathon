import React from 'react';
import { BookOpen, Brain, Calendar, Video, Users, ArrowRight, Search, FileText, Zap, Sparkles, GraduationCap } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string) => void;
  isLoggedIn: boolean;
}

export default function HomePage({ onNavigate, isLoggedIn }: HomePageProps) {
  const features = [
    {
      icon: FileText,
      title: 'Smart Notes',
      description: 'Upload and organize your study materials with AI-powered summaries and insights.',
      color: 'from-blue-500 to-blue-600',
      view: 'notes'
    },
    {
      icon: Brain,
      title: 'Flip Cards',
      description: 'Create flashcards automatically from your notes or manually for effective memorization.',
      color: 'from-purple-500 to-purple-600',
      view: 'flipcards'
    },
    {
      icon: Users,
      title: 'Communities',
      description: 'Join subject-specific communities to connect with fellow learners.',
      color: 'from-teal-500 to-teal-600',
      view: 'communities'
    },
    {
      icon: Calendar,
      title: 'Study Sessions',
      description: 'Schedule or join collaborative study sessions with video conferencing.',
      color: 'from-green-500 to-green-600',
      view: 'study-sessions'
    },
    {
      icon: Video,
      title: 'Infovids',
      description: 'Watch and create short educational videos on complex topics.',
      color: 'from-pink-500 to-pink-600',
      view: 'infovids'
    },
    {
      icon: BookOpen,
      title: 'EduStore',
      description: 'Access premium courses, e-books, and educational resources.',
      color: 'from-yellow-500 to-yellow-600',
      view: 'store'
    }
  ];

  const publicContent = [
    {
      title: 'Public Notes',
      description: 'Browse study materials shared by the community',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      view: 'public-notes'
    },
    {
      title: 'Public Flip Cards',
      description: 'Discover flashcard sets on various subjects',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      view: 'public-flipcards'
    },
    {
      title: 'Public Communities',
      description: 'Join subject-specific learning groups',
      icon: Users,
      color: 'from-teal-500 to-teal-600',
      view: 'public-communities'
    },
    {
      title: 'Public Study Sessions',
      description: 'Participate in upcoming collaborative sessions',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      view: 'public-sessions'
    },
    {
      title: 'Public Infovids',
      description: 'Watch educational videos from the community',
      icon: Video,
      color: 'from-pink-500 to-pink-600',
      view: 'public-infovids'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 mb-6">
              Your Growth, Our Community
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              The ultimate learning platform for students to collaborate, share knowledge, and achieve academic excellence together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'login')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <span>{isLoggedIn ? 'Go to Dashboard' : 'Get Started'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Explore</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Supercharge Your Learning</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            StudyMates combines powerful tools and a supportive community to transform how you learn and collaborate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 mb-6">{feature.description}</p>
              <button
                onClick={() => onNavigate(isLoggedIn ? feature.view : 'login')}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-2 transition-colors"
              >
                <span>{isLoggedIn ? 'Explore Now' : 'Sign In to Access'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Public Content Section */}
      <div className="bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Explore Public Content</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover a wealth of educational resources shared by our community, no account required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicContent.map((item, index) => (
              <button
                key={index}
                onClick={() => onNavigate(item.view)}
                className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 border border-gray-700 text-left transition-all duration-300 flex items-start space-x-4"
              >
                <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color} shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-teal-900/50 rounded-3xl p-10 sm:p-16 border border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 30 + 20}px`
                }}
              >
                {i % 5 === 0 ? <BookOpen /> : 
                 i % 5 === 1 ? <Brain /> : 
                 i % 5 === 2 ? <GraduationCap /> : 
                 i % 5 === 3 ? <Users /> : <Zap />}
              </div>
            ))}
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Join Our Learning Community</h2>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-10">
              Create an account to unlock all features, connect with study partners, and take your learning to the next level.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => onNavigate('login')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center space-x-2 w-full sm:w-auto justify-center"
              >
                <span>{isLoggedIn ? 'Go to Dashboard' : 'Sign Up Now'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="px-8 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 backdrop-blur-sm w-full sm:w-auto justify-center flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Explore First</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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