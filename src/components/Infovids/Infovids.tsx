import React, { useState } from 'react';
import { Video, Play, Heart, Share2, Plus, Search, Filter, User, Clock, Eye, Upload, X, Trash2, Link } from 'lucide-react';
import type { VideoReel, User as UserType } from '../../types';

interface InfovidsProps {
  user: UserType;
  infovids?: VideoReel[];
  onCreateInfovid?: (infovid: Omit<VideoReel, 'id' | 'creatorId' | 'views' | 'likes' | 'createdDate'>) => void;
  onDeleteInfovid?: (infovidId: string) => void;
}

/**
 * Infovid Preview Modal - Same design as other preview modals
 */
const InfovidPreviewModal = ({ infovid, onClose, onLikeToggle, onShare, onDeleteInfovid, user }) => {
  if (!infovid) return null;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyPrivateLink = () => {
    const privateLink = `${window.location.origin}/private/infovid/${infovid.id}`;
    navigator.clipboard.writeText(privateLink);
    alert('Private link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-gray-700 relative m-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0 mt-1">
            <Video className="w-8 h-8 text-pink-400" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">{infovid.title}</h3>
            <span className="text-pink-400 font-medium">Infovid Preview</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Video player */}
          <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden relative">
            <video
              src={infovid.videoUrl}
              poster={infovid.thumbnailUrl}
              controls
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
              {formatDuration(infovid.duration)}
            </div>
          </div>

          {/* Creator and stats */}
          <div className="flex items-start space-x-3 text-gray-400">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              {infovid.creatorProfilePicture ? (
                <img src={infovid.creatorProfilePicture} alt={infovid.creatorName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-base font-medium text-gray-300">Created by {infovid.creatorName}</p>
              <p className="text-xs text-gray-500">on {new Date(infovid.createdDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
            <p className="text-gray-300 leading-relaxed">{infovid.description}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{infovid.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className={`w-4 h-4 ${infovid.isLiked ? 'text-red-500 fill-current' : ''}`} />
                <span>{infovid.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(infovid.duration)}</span>
              </div>
            </div>
            <span className="text-pink-400 font-medium">{infovid.subject}</span>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mt-4">
            {infovid.creatorId === user.id && (
              <button
                onClick={() => onDeleteInfovid(infovid.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete</span>
              </button>
            )}
            
            <button
              onClick={() => onLikeToggle(infovid.id)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
                infovid.isLiked 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <Heart className={`w-5 h-5 ${infovid.isLiked ? 'fill-current' : ''}`} />
              <span>{infovid.isLiked ? 'Liked' : 'Like'}</span>
            </button>
            
            <button
              onClick={handleCopyPrivateLink}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Link className="w-5 h-5" />
              <span>Copy Link</span>
            </button>
            
            <button
              onClick={() => onShare(infovid)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Infovids({ user, infovids = [], onCreateInfovid, onDeleteInfovid }: InfovidsProps) {
  const [selectedInfovid, setSelectedInfovid] = useState<VideoReel | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'created' | 'saved'>('all');
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    subject: '',
    tags: '',
    videoFile: null as File | null,
    thumbnailFile: null as File | null
  });

  // Filter infovids based on the selected filter type, subject, and search query
  const filteredInfovids = infovids.filter(infovid => {
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'created' && infovid.creatorId === user.id) ||
                         (filterType === 'saved' && infovid.creatorId !== user.id);
    
    const matchesSearch = infovid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         infovid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         infovid.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = filterSubject === 'all' || infovid.subject.toLowerCase() === filterSubject.toLowerCase();
    
    return matchesFilter && matchesSearch && matchesSubject;
  });

  const handleLikeToggle = (infovidId: string) => {
    console.log('Toggle like for infovid:', infovidId);
  };

  const handleShare = (infovid: VideoReel) => {
    if (navigator.share) {
      navigator.share({
        title: infovid.title,
        text: infovid.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCreateInfovid = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInfovid = {
      title: createData.title,
      description: createData.description,
      videoUrl: 'https://example.com/video.mp4', // In real app, this would be uploaded
      thumbnailUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400', // Default or uploaded
      creatorName: user.name,
      creatorProfilePicture: user.profilePicture,
      duration: 300, // Default 5 minutes
      tags: createData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      subject: createData.subject
    };
    
    if (onCreateInfovid) {
      onCreateInfovid(newInfovid);
    }
    
    console.log('Creating infovid:', newInfovid);
    setShowCreateModal(false);
    setCreateData({
      title: '',
      description: '',
      subject: '',
      tags: '',
      videoFile: null,
      thumbnailFile: null
    });
  };

  const handleVideoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setCreateData(prev => ({ ...prev, videoFile: file }));
      }
    };
    input.click();
  };

  const handleThumbnailUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setCreateData(prev => ({ ...prev, thumbnailFile: file }));
      }
    };
    input.click();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayVideo = (infovid: VideoReel) => {
    setSelectedInfovid(infovid);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Infovids</h2>
            <p className="text-gray-400">Learn through short, engaging educational videos</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Infovid</span>
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
                placeholder="Search infovids by title, description, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'created' | 'saved')}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Infovids</option>
                <option value="created">Created by Me</option>
                <option value="saved">Saved</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
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

        {/* Infovids Grid - Updated to match consistent card design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredInfovids.map((infovid) => (
            <div key={infovid.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
                <img 
                  src={infovid.thumbnailUrl} 
                  alt={infovid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handlePlayVideo(infovid)}
                    className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm hover:bg-opacity-30 transition-colors"
                  >
                    <Play className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                  {formatDuration(infovid.duration)}
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full">
                  {infovid.subject}
                </div>
              </div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-pink-400" />
                  <h4 className="font-semibold text-white group-hover:text-pink-400 transition-colors text-sm">
                    {infovid.title}
                  </h4>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handlePlayVideo(infovid);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Play Video"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  {infovid.creatorId === user.id && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (onDeleteInfovid) onDeleteInfovid(infovid.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Infovid"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLikeToggle(infovid.id);
                    }}
                    className={`p-1 transition-colors ${
                      infovid.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                    }`}
                    title="Like Infovid"
                  >
                    <Heart className={`w-4 h-4 ${infovid.isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{infovid.description}</p>

              {/* Creator & Stats info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                    {infovid.creatorProfilePicture ? (
                      <img src={infovid.creatorProfilePicture} alt={infovid.creatorName} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{infovid.creatorId === user.id ? 'Created by you' : infovid.creatorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{infovid.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{infovid.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredInfovids.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {filterType === 'created' ? 'You haven\'t created any infovids yet' :
                 filterType === 'saved' ? 'You haven\'t saved any infovids yet' :
                 'No infovids found'}
              </h3>
              <p className="text-gray-400 mb-6">
                {filterType === 'created' ? 'Create your first educational video to share knowledge' :
                 filterType === 'saved' ? 'Save infovids from the community to watch later' :
                 'Try adjusting your search terms or filters, or create your first infovid'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Infovid</span>
              </button>
            </div>
          )}
        </div>

        {/* Create Infovid Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Create Educational Infovid</h3>
              
              <form onSubmit={handleCreateInfovid} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video Upload
                  </label>
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleVideoUpload}
                      className="w-full border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-pink-500 transition-colors flex flex-col items-center space-y-2 text-gray-400 hover:text-pink-400"
                    >
                      <Video className="w-8 h-8" />
                      <span className="text-sm">
                        {createData.videoFile ? createData.videoFile.name : 'Click to upload or drag and drop'}
                      </span>
                      <span className="text-xs text-gray-500">MP4, MOV up to 100MB</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleThumbnailUpload}
                    className="w-full border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-pink-500 transition-colors flex flex-col items-center space-y-2 text-gray-400 hover:text-pink-400"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">
                      {createData.thumbnailFile ? createData.thumbnailFile.name : 'Upload custom thumbnail'}
                    </span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={createData.title}
                    onChange={(e) => setCreateData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Enter infovid title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={createData.description}
                    onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Describe your educational content"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <select 
                    value={createData.subject}
                    onChange={(e) => setCreateData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
                    required
                  >
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
                    value={createData.tags}
                    onChange={(e) => setCreateData(prev => ({ ...prev, tags: e.target.value }))}
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
                    Create Infovid
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Infovid Preview Modal */}
        {selectedInfovid && (
          <InfovidPreviewModal
            infovid={selectedInfovid}
            user={user}
            onClose={() => setSelectedInfovid(null)}
            onLikeToggle={handleLikeToggle}
            onShare={handleShare}
            onDeleteInfovid={onDeleteInfovid}
          />
        )}
      </div>
    </div>
  );
}