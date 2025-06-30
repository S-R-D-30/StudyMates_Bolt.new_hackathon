import React, { useState } from 'react';
import { Video, Play, Heart, Share2, Plus, Search, Filter, User, Clock, Eye, ArrowLeft, Save } from 'lucide-react';
import type { VideoReel } from '../../types';

interface PublicInfovidsProps {
  onNavigate: (view: string) => void;
  onSaveInfovid?: (reelId: string) => void;
  isLoggedIn: boolean;
}

export default function PublicInfovids({ onNavigate, onSaveInfovid, isLoggedIn }: PublicInfovidsProps) {
  const [selectedReel, setSelectedReel] = useState<VideoReel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Sample reels data
  const sampleReels: VideoReel[] = [
    {
      id: '1',
      title: 'Understanding Derivatives in 5 Minutes',
      description: 'Quick explanation of derivatives with visual examples',
      videoUrl: 'https://example.com/video1.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '2',
      creatorName: 'Sarah Johnson',
      creatorProfilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      duration: 300,
      views: 1247,
      likes: 89,
      tags: ['calculus', 'derivatives', 'mathematics'],
      subject: 'Mathematics',
      createdDate: '2024-01-15T10:00:00Z',
      isLiked: false
    },
    {
      id: '2',
      title: 'Quantum Physics Explained Simply',
      description: 'Understanding quantum mechanics through simple analogies',
      videoUrl: 'https://example.com/video2.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '4',
      creatorName: 'Emma Davis',
      duration: 420,
      views: 856,
      likes: 67,
      tags: ['quantum', 'physics', 'waves'],
      subject: 'Physics',
      createdDate: '2024-01-14T15:30:00Z',
      isLiked: false
    },
    {
      id: '3',
      title: 'Organic Chemistry Reactions',
      description: 'Step-by-step breakdown of common organic reactions',
      videoUrl: 'https://example.com/video3.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '5',
      creatorName: 'Alex Rodriguez',
      duration: 360,
      views: 634,
      likes: 45,
      tags: ['organic', 'chemistry', 'reactions'],
      subject: 'Chemistry',
      createdDate: '2024-01-13T12:00:00Z',
      isLiked: false
    },
    {
      id: '4',
      title: 'Programming Fundamentals',
      description: 'Basic programming concepts explained clearly',
      videoUrl: 'https://example.com/video4.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '3',
      creatorName: 'Mike Chen',
      duration: 480,
      views: 923,
      likes: 78,
      tags: ['programming', 'fundamentals', 'algorithms'],
      subject: 'Computer Science',
      createdDate: '2024-01-12T18:45:00Z',
      isLiked: false
    }
  ];

  const filteredReels = sampleReels.filter(reel => {
    const matchesSearch = reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = filterSubject === 'all' || reel.subject.toLowerCase() === filterSubject.toLowerCase();
    
    return matchesSearch && matchesSubject;
  });

  const handleLikeClick = (reelId: string) => {
    // For the public view, clicking 'like' prompts the user to log in
    if (!isLoggedIn) {
      alert('Please log in to like this video!');
      onNavigate('login');
    }
  };

  const handleSaveInfovid = (reelId: string) => {
    // For the public view, clicking 'save' prompts the user to log in
    if (isLoggedIn) {
      if (onSaveInfovid) {
        onSaveInfovid(reelId);
      }
    } else {
      alert('Please log in to save this infovid!');
      onNavigate('login');
    }
  };

  const handleShare = (reel: VideoReel) => {
    if (navigator.share) {
      navigator.share({
        title: reel.title,
        text: reel.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics': return 'bg-purple-600';
      case 'physics': return 'bg-blue-600';
      case 'chemistry': return 'bg-green-600';
      case 'computer science': return 'bg-pink-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Public Infovids</h2>
            <p className="text-gray-400">Learn through short, engaging educational videos</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search infovids by title, description, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Subjects</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="computer science">Computer Science</option>
                <option value="biology">Biology</option>
              </select>
            </div>
          </div>
        </div>

        {/* Infovids Grid - Matching the image design exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredReels.map((reel) => (
            <div key={reel.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
                <img 
                  src={reel.thumbnailUrl} 
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* Subject badge in top left */}
                <div className={`absolute top-2 left-2 px-2 py-1 ${getSubjectColor(reel.subject)} text-white text-xs rounded font-medium`}>
                  {reel.subject}
                </div>
                {/* Duration in bottom right */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                  {formatDuration(reel.duration)}
                </div>
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => setSelectedReel(reel)}
                    className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm hover:bg-opacity-30 transition-colors"
                  >
                    <Play className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-pink-400" />
                  <h4 className="font-semibold text-white group-hover:text-pink-400 transition-colors text-sm">
                    {reel.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-1 ml-auto">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedReel(reel);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveInfovid(reel.id);
                    }}
                    className="p-1 text-gray-400 hover:text-pink-400 transition-colors"
                    title="Save Infovid"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{reel.description}</p>

              {/* Creator & Stats info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                    {reel.creatorProfilePicture ? (
                      <img src={reel.creatorProfilePicture} alt={reel.creatorName} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{reel.creatorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{reel.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{reel.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredReels.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No infovids found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
              <button
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Login to Create an Infovid</span>
              </button>
            </div>
          )}
        </div>

        {/* Video Player Modal */}
        {selectedReel && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="max-w-4xl w-full">
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
                {/* Video Player */}
                <div className="aspect-video bg-black relative">
                  <video 
                    src={selectedReel.videoUrl}
                    poster={selectedReel.thumbnailUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-xl mb-2">{selectedReel.title}</h3>
                      <p className="text-gray-400 text-sm">{selectedReel.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedReel(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                      {selectedReel.creatorProfilePicture ? (
                        <img 
                          src={selectedReel.creatorProfilePicture} 
                          alt={selectedReel.creatorName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-gray-300 text-sm">{selectedReel.creatorName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{selectedReel.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(selectedReel.duration)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLikeClick(selectedReel.id)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSaveInfovid(selectedReel.id)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShare(selectedReel)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}