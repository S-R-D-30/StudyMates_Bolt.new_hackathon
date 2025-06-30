import React, { useState } from 'react';
import { X, User, UserPlus, UserMinus, UserCheck } from 'lucide-react';
import type { User as UserType } from '../../types';

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'followers' | 'following';
  users: UserType[];
  currentUser: UserType;
  onFollowToggle: (userId: string, action: 'follow' | 'unfollow' | 'followback') => void;
}

export default function FollowersModal({ 
  isOpen, 
  onClose, 
  type, 
  users, 
  currentUser, 
  onFollowToggle 
}: FollowersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {type === 'followers' ? 'Followers' : 'Following'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${type}...`}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
          />
        </div>

        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
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
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>

                {type === 'followers' ? (
                  // For followers, show "Follow Back" or "Following" button
                  user.isFollowing ? (
                    <button
                      onClick={() => onFollowToggle(user.id, 'unfollow')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onFollowToggle(user.id, 'followback')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Follow Back</span>
                    </button>
                  )
                ) : (
                  // For following, show "Unfollow" button
                  <button
                    onClick={() => onFollowToggle(user.id, 'unfollow')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>Unfollow</span>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery 
                  ? `No ${type} found matching "${searchQuery}"`
                  : `No ${type === 'followers' ? 'followers' : 'following'} yet`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}