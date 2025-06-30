import React, { useState } from 'react';
import { Users, Plus, Search, Lock, Globe, User, Calendar, Tag, MessageCircle, Send, Filter, Eye, X, UserPlus } from 'lucide-react';
import type { Community, Post, User as UserType } from '../../types';

interface PublicCommunitiesProps {
  onNavigate: (view: string) => void;
  user: UserType | null; // User can be null if not logged in
  onJoinCommunity?: (communityId: string) => void;
  isLoggedIn: boolean;
}

/**
 * Community Preview Modal - Same design as other preview modals
 */
const CommunityPreviewModal = ({ community, onClose, onJoinCommunity, isLoggedIn }) => {
  if (!community) return null;

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'community': return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const handleJoinCommunity = () => {
    if (isLoggedIn) {
      onJoinCommunity(community.id);
    } else {
      alert('Please log in to join communities');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-gray-700 relative m-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0 mt-1">
            <Users className="w-8 h-8 text-teal-400" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">{community.name}</h3>
            <span className="text-teal-400 font-medium">Community Preview</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Community thumbnail */}
          <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden">
            <img src={community.posterUrl || getDefaultThumbnail('community')} alt={community.name} className="w-full h-full object-cover" />
          </div>

          {/* Community info */}
          <div className="flex items-start space-x-3 text-gray-400">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              <Users className="w-6 h-6 text-gray-500 m-2" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-300">{community.memberCount} members</p>
              <p className="text-xs text-gray-500">Created on {new Date(community.createdDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
            <p className="text-gray-300 leading-relaxed">{community.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {community.tags?.map(tag => (
              <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Visibility */}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            {community.isPrivate ? (
              <Lock className="w-4 h-4 text-yellow-500" />
            ) : (
              <Globe className="w-4 h-4 text-green-500" />
            )}
            <span>{community.isPrivate ? 'Private Community' : 'Public Community'}</span>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mt-4">
            {!community.isMember && (
              <button
                onClick={handleJoinCommunity}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Join Community</span>
              </button>
            )}
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>View Posts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PublicCommunities({ onNavigate, user, onJoinCommunity, isLoggedIn }: PublicCommunitiesProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewCommunity, setPreviewCommunity] = useState<Community | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [postContent, setPostContent] = useState('');

  // Sample public and private communities data
  const publicCommunities: Community[] = [
    {
      id: '1',
      name: 'Computer Science Hub',
      description: 'A community for CS students to share resources, discuss algorithms, and collaborate on projects.',
      posterUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '2',
      memberCount: 1247,
      isPrivate: false,
      tags: ['computer-science', 'programming', 'algorithms'],
      createdDate: '2024-01-01T00:00:00Z',
      isMember: true, // Assuming the user is a member of this one for demonstration
    },
    {
      id: '2',
      name: 'Mathematics Masters',
      description: 'Advanced mathematics discussions, problem solving, and research collaboration.',
      posterUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '3',
      memberCount: 856,
      isPrivate: true,
      tags: ['mathematics', 'calculus', 'algebra'],
      createdDate: '2024-01-05T00:00:00Z',
      isMember: false,
    },
    {
      id: '3',
      name: 'Physics Phenomena',
      description: 'Exploring the wonders of physics from quantum mechanics to astrophysics.',
      posterUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '4',
      memberCount: 634,
      isPrivate: false,
      tags: ['physics', 'quantum', 'astrophysics'],
      createdDate: '2024-01-10T00:00:00Z',
      isMember: true,
    },
    {
      id: '4',
      name: 'Chemistry Corner',
      description: 'Organic, inorganic, and analytical chemistry discussions and lab tips.',
      posterUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '5',
      memberCount: 423,
      isPrivate: false,
      tags: ['chemistry', 'organic', 'lab'],
      createdDate: '2024-01-12T00:00:00Z',
      isMember: false,
    },
    {
      id: '5',
      name: 'Biology Study Group',
      description: 'Explore life sciences and biological research together.',
      posterUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '6',
      memberCount: 789,
      isPrivate: false,
      tags: ['biology'],
      createdDate: '2024-01-07T00:00:00Z',
      isMember: false,
    },
    {
      id: '6',
      name: 'Engineering Solutions',
      description: 'Collaborative problem solving for engineering challenges.',
      posterUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      creatorId: '7',
      memberCount: 945,
      isPrivate: false,
      tags: ['engineering'],
      createdDate: '2024-01-06T00:00:00Z',
      isMember: false,
    }
  ];

  // Sample posts for a selected community
  // In a real app, this would be fetched from a database based on selectedCommunity.id
  const samplePosts: Post[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Sarah Johnson',
      userProfilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Just finished implementing a binary search tree in Python! The recursive approach really clicked for me. Anyone want to discuss different traversal methods?',
      timestamp: '2024-01-15T14:30:00Z',
      communityId: selectedCommunity?.id,
    },
    {
      id: '2',
      userId: '3',
      userName: 'Mike Chen',
      content: 'Working on dynamic programming problems. The coin change problem is a great starting point for understanding optimal substructure. Here\'s my solution approach...',
      timestamp: '2024-01-15T12:15:00Z',
      communityId: selectedCommunity?.id,
    },
  ];

  const filteredCommunities = publicCommunities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = filterSubject === 'all' || 
                          community.tags.some(tag => {
                            switch (filterSubject) {
                              case 'mathematics': return ['mathematics', 'calculus', 'algebra'].includes(tag.toLowerCase());
                              case 'physics': return ['physics', 'quantum', 'astrophysics'].includes(tag.toLowerCase());
                              case 'chemistry': return ['chemistry', 'organic', 'lab'].includes(tag.toLowerCase());
                              case 'computer science': return ['computer-science', 'programming', 'algorithms'].includes(tag.toLowerCase());
                              case 'biology': return ['biology'].includes(tag.toLowerCase());
                              case 'engineering': return ['engineering'].includes(tag.toLowerCase());
                              default: return true;
                            }
                          });
    
    return matchesSearch && matchesSubject;
  });

  const handleJoinCommunity = (communityId: string) => {
    // Check if the user is logged in
    if (!isLoggedIn) {
      alert('You must be logged in to join a community.');
      onNavigate('login');
      return;
    }
    
    // Call the provided join handler if available
    if (onJoinCommunity) {
      onJoinCommunity(communityId);
    } else {
      // Fallback if no handler provided
      console.log('Joining community:', communityId);
      alert('Request to join sent! (Placeholder)');
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('You must be logged in to create posts.');
      return;
    }
    
    if (postContent.trim() && selectedCommunity) {
      console.log('Creating post in community:', selectedCommunity.id, postContent);
      setPostContent('');
      // You would send the post data to your backend here
    }
  };

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'community': return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  // ----- VIEW FOR A SELECTED COMMUNITY (Full Page View) -----
  if (selectedCommunity) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Community Header */}
          <div className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden mb-8 shadow-lg">
            {selectedCommunity.posterUrl && (
              <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                <img 
                  src={selectedCommunity.posterUrl} 
                  alt={selectedCommunity.name}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">{selectedCommunity.name}</h1>
                    {selectedCommunity.isPrivate ? (
                      <Lock className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Globe className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-300 mb-4">{selectedCommunity.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{selectedCommunity.memberCount} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created {new Date(selectedCommunity.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCommunity(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors flex items-center justify-center"
                >
                  Back to Communities
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedCommunity.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-600">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Post Creation (Visible only if user is a member) */}
          {isLoggedIn && selectedCommunity.isMember && (
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-8 shadow-sm">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm">
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder={`Share something with ${selectedCommunity.name}...`}
                      className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-white placeholder-gray-400"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={!postContent.trim()}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                        <span className="font-medium">Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Community Posts */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Community Feed</h2>
            {isLoggedIn && selectedCommunity.isMember ? (
              <>
                {samplePosts.map((post) => (
                  <div key={post.id} className="bg-gray-900 rounded-2xl border border-gray-700 p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm">
                          {post.userProfilePicture ? (
                            <img 
                              src={post.userProfilePicture} 
                              alt={post.userName}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-medium text-white">{post.userName}</p>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{post.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {samplePosts.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No posts yet. Be the first to share something!</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-2xl border border-gray-700 p-8">
                <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">This is a private community.</h3>
                <p className="text-gray-400">You must be a member to view posts and participate in the discussion.</p>
                <button
                  onClick={() => handleJoinCommunity(selectedCommunity.id)}
                  className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center mx-auto space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  <span>Request to Join</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----- MAIN VIEW: LIST OF ALL PUBLIC COMMUNITIES -----
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Public Communities</h2>
            <p className="text-gray-400">Discover and join study groups and subject-specific communities</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search communities by name, description, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Subjects</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="computer science">Computer Science</option>
                <option value="biology">Biology</option>
                <option value="engineering">Engineering</option>
              </select>
            </div>
          </div>
        </div>

        {/* Communities Grid - Matching the image design exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCommunities.map((community) => (
            <div key={community.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden">
                <img src={community.posterUrl || getDefaultThumbnail('community')} alt={community.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              </div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  <h4 className="font-semibold text-white group-hover:text-teal-400 transition-colors text-sm">
                    {community.name}
                  </h4>
                </div>
                <div className="flex items-center space-x-1 ml-auto">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewCommunity(community);
                      setShowPreviewModal(true);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {!community.isMember && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleJoinCommunity(community.id);
                      }}
                      className="p-1 text-gray-400 hover:text-teal-400 transition-colors"
                      title={community.isPrivate ? "Request to Join" : "Join Community"}
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  )}
                  {community.isPrivate ? (
                    <Lock className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Globe className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{community.description}</p>

              {/* Member count */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <span>{community.memberCount} members</span>
                </div>
                <span>{community.isPrivate ? 'Private' : 'Public'}</span>
              </div>
            </div>
          ))}

          {filteredCommunities.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No communities found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {/* Community Preview Modal */}
        {showPreviewModal && previewCommunity && (
          <CommunityPreviewModal
            community={previewCommunity}
            onClose={() => {
              setShowPreviewModal(false);
              setPreviewCommunity(null);
            }}
            onJoinCommunity={handleJoinCommunity}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  );
}