import React, { useState } from 'react';
import { Video, Play, Heart, Share2, BookOpen, User, Clock, Eye, Plus, Search, Filter } from 'lucide-react';
import type { VideoReel, User as UserType } from '../../types';

interface ReelsProps {
  user: UserType;
}

export default function Reels({ user }: ReelsProps) {
  const [selectedReel, setSelectedReel] = useState<VideoReel | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Sample reels data
  const sampleReels: VideoReel[] = [
    {
      id: '1',
      title: 'Quick Calculus: Understanding Derivatives',
      description: 'A 2-minute explanation of derivatives with visual examples',
      videoUrl: 'https://example.com/video1.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '2',
      creatorName: 'Sarah Johnson',
      creatorProfilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      duration: 120,
      views: 1247,
      likes: 89,
      tags: ['calculus', 'derivatives', 'mathematics'],
      subject: 'Mathematics',
      createdDate: '2024-01-15T10:00:00Z',
      isLiked: false
    },
    {
      id: '2',
      title: 'Physics Explained: Wave-Particle Duality',
      description: 'Understanding quantum mechanics through simple analogies',
      videoUrl: 'https://example.com/video2.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '4',
      creatorName: 'Emma Davis',
      duration: 180,
      views: 856,
      likes: 67,
      tags: ['quantum', 'physics', 'waves'],
      subject: 'Physics',
      createdDate: '2024-01-14T15:30:00Z',
      isLiked: true
    },
    {
      id: '3',
      title: 'Organic Chemistry: Reaction Mechanisms',
      description: 'Step-by-step breakdown of common organic reactions',
      videoUrl: 'https://example.com/video3.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '5',
      creatorName: 'Alex Rodriguez',
      duration: 240,
      views: 634,
      likes: 45,
      tags: ['organic', 'chemistry', 'reactions'],
      subject: 'Chemistry',
      createdDate: '2024-01-13T12:00:00Z',
      isLiked: false
    },
    {
      id: '4',
      title: 'Data Structures: Binary Trees Explained',
      description: 'Visual guide to understanding binary tree operations',
      videoUrl: 'https://example.com/video4.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '3',
      creatorName: 'Mike Chen',
      duration: 300,
      views: 923,
      likes: 78,
      tags: ['programming', 'data-structures', 'algorithms'],
      subject: 'Computer Science',
      createdDate: '2024-01-12T18:45:00Z',
      isLiked: true
    }
  ];

  const filteredReels = sampleReels.filter(reel => {
    const matchesSearch = reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = filterSubject === 'all' || reel.subject.toLowerCase() === filterSubject.toLowerCase();
    
    return matchesSearch && matchesSubject;
  });

  const handleLikeToggle = (reelId: string) => {
    console.log('Toggle like for reel:', reelId);
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
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Public Infovids </h2>
            <p className="text-gray-400">Learn through short, engaging educational videos</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Infovids</span>
          </button>
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
                placeholder="Search reels by title, description, or tags..."
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

        {/* Reels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReels.map((reel) => (
            <div key={reel.id} className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group">
              {/* Video Thumbnail */}
              <div className="relative aspect-[9/16] bg-gray-800">
                <img 
                  src={reel.thumbnailUrl} 
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => setSelectedReel(reel)}
                    className="p-4 bg-white bg-opacity-20 rounded-full backdrop-blur-sm hover:bg-opacity-30 transition-colors"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                  {formatDuration(reel.duration)}
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full">
                  {reel.subject}
                </div>
              </div>

              {/* Reel Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                  {reel.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{reel.description}</p>

                {/* Creator Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                    {reel.creatorProfilePicture ? (
                      <img 
                        src={reel.creatorProfilePicture} 
                        alt={reel.creatorName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-300 text-sm">{reel.creatorName}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{reel.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className={`w-4 h-4 ${reel.isLiked ? 'text-red-500 fill-current' : ''}`} />
                      <span>{reel.likes}</span>
                    </div>
                  </div>
                  <span>{new Date(reel.createdDate).toLocaleDateString()}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {reel.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLikeToggle(reel.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                      reel.isLiked 
                        ? 'bg-red-900/50 text-red-400 border border-red-700' 
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${reel.isLiked ? 'fill-current' : ''}`} />
                    <span>Like</span>
                  </button>
                  <button
                    onClick={() => handleShare(reel)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredReels.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No reels found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Reel</span>
              </button>
            </div>
          )}
        </div>

        {/* Create Reel Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Create Educational Reel</h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video Upload
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-pink-500 transition-colors">
                    <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-xs mt-1">MP4, MOV up to 100MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Enter reel title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Describe your educational content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white">
                    <option value="">Select subject</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="biology">Biology</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="calculus, derivatives, mathematics"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg"
                  >
                    Create Reel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {selectedReel && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="max-w-md w-full">
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
                {/* Video Player */}
                <div className="aspect-[9/16] bg-black relative">
                  <img 
                    src={selectedReel.thumbnailUrl} 
                    alt={selectedReel.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="p-4 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-white mb-2">{selectedReel.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{selectedReel.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
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
                    <button
                      onClick={() => setSelectedReel(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
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
                        onClick={() => handleLikeToggle(selectedReel.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedReel.isLiked 
                            ? 'bg-red-900/50 text-red-400' 
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${selectedReel.isLiked ? 'fill-current' : ''}`} />
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