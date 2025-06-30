import React, { useState } from 'react';
import { Users, Plus, Search, Lock, Globe, User, Calendar, Tag, MessageCircle, Send, Filter, Eye, X, Upload, Trash2, Link, UserPlus } from 'lucide-react';
import type { Community, Post, User as UserType } from '../../types';

interface CommunitiesProps {
  user: UserType;
  communities?: Community[];
  posts?: Post[];
  onCreateCommunity?: (community: Omit<Community, 'id' | 'creatorId' | 'memberCount' | 'createdDate'>) => void;
  onJoinCommunity?: (communityId: string) => void;
  onDeleteCommunity?: (communityId: string) => void;
}

/**
 * Community Preview Modal - Same design as other preview modals
 */
const CommunityPreviewModal = ({ community, onClose, onJoinCommunity, onDeleteCommunity, user }) => {
  if (!community) return null;

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'community': return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const handleCopyPrivateLink = () => {
    const privateLink = `${window.location.origin}/private/community/${community.id}`;
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
            {community.creatorId === user.id ? (
              <button
                onClick={() => onDeleteCommunity(community.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Community</span>
              </button>
            ) : !community.isMember ? (
              <button
                onClick={() => onJoinCommunity(community.id)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                {community.isPrivate ? (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Request to Join</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Join Community</span>
                  </>
                )}
              </button>
            ) : null}
            
            {community.isPrivate && (
              <button
                onClick={handleCopyPrivateLink}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Link className="w-5 h-5" />
                <span>Copy Private Link</span>
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

export default function Communities({
  user,
  communities = [],
  posts = [],
  onCreateCommunity,
  onJoinCommunity,
  onDeleteCommunity,
}: CommunitiesProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewCommunity, setPreviewCommunity] = useState<Community | null>(null);
  const [postContent, setPostContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'joined' | 'created'>('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [createData, setCreateData] = useState({
    name: '',
    description: '',
    tags: '',
    isPrivate: false,
    thumbnailUrl: ''
  });

  // Combine user communities with any passed in communities
  const allCommunities = [...communities];

  // Filter communities based on the selected filter type first
  const baseFilteredSets = allCommunities.filter(community => {
    switch (filterType) {
      case 'joined':
        return community.isMember && community.creatorId !== user.id;
      case 'created':
        return community.creatorId === user.id;
      default: // 'all'
        return community.isMember || community.creatorId === user.id; // Only show user's communities
    }
  });

  // Then, filter by the search query
  const filteredCommunities = baseFilteredSets.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (community.tags && community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    const newCommunity = {
      name: createData.name,
      description: createData.description,
      tags: createData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isPrivate: createData.isPrivate,
      isMember: true, // Creator is always a member
      posterUrl: createData.thumbnailUrl || undefined
    };
    if (onCreateCommunity) {
      onCreateCommunity(newCommunity);
    }
    setCreateData({ name: '', description: '', tags: '', isPrivate: false, thumbnailUrl: '' });
    setShowCreateModal(false);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim() && selectedCommunity) {
      console.log('Creating post in community:', selectedCommunity.id, postContent);
      setPostContent('');
    }
  };

  const handleThumbnailUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCreateData(prev => ({
            ...prev,
            thumbnailUrl: e.target?.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'community': return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  if (selectedCommunity) {
    return (
        <div className="min-h-screen bg-gray-950">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           {/* Community Header */}
           <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-8 shadow-lg">
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
                 className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors"
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

           {/* Post Creation */}
           {selectedCommunity.isMember && (
             <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-8 shadow-sm">
               <form onSubmit={handleCreatePost} className="space-y-4">
                 <div className="flex items-start space-x-4">
                   <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm">
                     {user.profilePicture ? (
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
             {posts.map((post) => (
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
                       <span className="text-sm text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</span>
                     </div>
                     <p className="text-gray-300">{post.content}</p>
                   </div>
                 </div>
               </div>
             ))}
             
             {posts.length === 0 && (
               <div className="text-center py-12">
                 <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                 <p className="text-gray-500">No posts yet. Be the first to share something!</p>
               </div>
             )}
           </div>
         </div>
       </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Communities</h2>
            <p className="text-gray-400">Manage communities you've joined or created</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'joined' | 'created')}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white text-sm"
              >
                <option value="all">All My Communities</option>
                <option value="joined">Joined Communities</option>
                <option value="created">Created by Me</option>
              </select>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create Community</span>
            </button>
          </div>
        </div>

        {/* Search */}
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
              </select>
            </div>
          </div>
        </div>

        {/* Communities Grid - Updated to match consistent card design */}
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
                <div className="flex space-x-1">
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
                  {community.creatorId === user.id && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (onDeleteCommunity) onDeleteCommunity(community.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Community"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {community.isPrivate ? (
                    <Lock className="w-4 h-4 text-yellow-500 p-1" />
                  ) : (
                    <Globe className="w-4 h-4 text-green-500 p-1" />
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{community.description}</p>

              {/* Member count & Tags */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <span>{community.memberCount} members</span>
                </div>
                {community.creatorId === user.id ? (
                  <span className="text-teal-400">Created by you</span>
                ) : (
                  <span>{community.isPrivate ? 'Private' : 'Public'}</span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCommunity(community)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  View
                </button>
                {!community.isMember && (
                  <button
                    onClick={() => onJoinCommunity && onJoinCommunity(community.id)}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-lg flex items-center justify-center space-x-1"
                  >
                    {community.isPrivate ? (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Request</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3 h-3" />
                        <span>Join</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Empty State - Matching the image design */}
          {filteredCommunities.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {filterType === 'created' ? 'You haven\'t created any communities' :
                 filterType === 'joined' ? 'You haven\'t joined any communities' :
                 'No communities found'}
              </h3>
              <p className="text-gray-400 mb-6">
                {filterType === 'created' ? 'Create or join a community to get started' :
                 filterType === 'joined' ? 'Explore and join a community to get started!' :
                 'Create or join a community to get started'}
              </p>
               <button
                 onClick={() => setShowCreateModal(true)}
                 className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors shadow-lg"
               >
                 <Plus className="w-5 h-5" />
                 <span>Create Community</span>
               </button>
            </div>
          )}
        </div>

        {/* Create Community Modal */}
        {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
                    <h3 className="text-2xl font-bold text-white mb-6">Create Community</h3>
                    <form onSubmit={handleCreateCommunity} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Community Thumbnail</label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={handleThumbnailUpload}
                                    className="flex-1 p-4 border-2 border-dashed border-gray-600 rounded-xl hover:border-teal-500 transition-colors flex flex-col items-center space-y-2 text-gray-400 hover:text-teal-400"
                                >
                                    <Upload className="w-6 h-6" />
                                    <span className="text-sm">Upload Thumbnail</span>
                                </button>
                                {createData.thumbnailUrl && (
                                    <div className="w-24 h-16 bg-gray-700 rounded-lg overflow-hidden">
                                        <img src={createData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Community Name</label>
                            <input
                                type="text"
                                value={createData.name}
                                onChange={(e) => setCreateData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter community name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                rows={3}
                                value={createData.description}
                                onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe your community"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={createData.tags}
                                onChange={(e) => setCreateData(prev => ({ ...prev, tags: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. mathematics, physics"
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="isPrivate"
                                checked={createData.isPrivate}
                                onChange={(e) => setCreateData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isPrivate" className="text-sm text-gray-300">Make this community private (invite-only)</label>
                        </div>
                        <div className="flex space-x-4">
                            <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800">Cancel</button>
                            <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Community Preview Modal */}
        {showPreviewModal && previewCommunity && (
          <CommunityPreviewModal
            community={previewCommunity}
            user={user}
            onClose={() => {
              setShowPreviewModal(false);
              setPreviewCommunity(null);
            }}
            onJoinCommunity={onJoinCommunity}
            onDeleteCommunity={onDeleteCommunity}
          />
        )}
      </div>
    </div>
  );
}