import React, { useState } from 'react';
import { User, FileText, Brain, Calendar, Trophy, Target, TrendingUp, Camera, Edit3, UserPlus, Users, Settings, Eye, EyeOff, MapPin, GraduationCap, Trash2, ShoppingBag, Video, MessageCircle, ArrowRight, RefreshCw, UserMinus, UserCheck } from 'lucide-react';
import FollowersModal from './FollowersModal';
import type { User as UserType, Note, FlipCardSet, Purchase, RecentActivity, Community } from '../../types';

interface ProfileProps {
  user: UserType;
  notes: Note[];
  flipCardSets: FlipCardSet[];
  purchases: Purchase[];
  recentActivities: RecentActivity[];
  savedCommunities: Community[];
  savedSessions: any[];
  savedInfovids: any[];
  savedCourses: any[];
  followers: UserType[];
  following: UserType[];
  onUpdateProfile?: (updates: Partial<UserType>) => void;
  onDeleteActivity: (activityId: string) => void;
  onDeleteAllActivities: () => void;
  onNavigate: (view: string) => void;
  onFollowUser: (user: UserType) => void;
  onUnfollowUser: (user: UserType) => void;
  onFollowBack: (user: UserType) => void;
}

export default function Profile({ 
  user, 
  notes, 
  flipCardSets, 
  purchases, 
  recentActivities,
  savedCommunities,
  savedSessions,
  savedInfovids,
  savedCourses,
  followers,
  following,
  onUpdateProfile,
  onDeleteActivity,
  onDeleteAllActivities,
  onNavigate,
  onFollowUser,
  onUnfollowUser,
  onFollowBack
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersModalType, setFollowersModalType] = useState<'followers' | 'following'>('followers');
  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio || '',
    education: user.education || '',
    location: user.location || '',
    profileVisibility: user.profileVisibility
  });

  const totalCards = flipCardSets.reduce((total, set) => total + set.cards.length, 0);
  
  // Filter content to show only user's created content and saved content
  const userNotes = notes.filter(note => note.userId === user.id);
  const userFlipCardSets = flipCardSets.filter(set => set.userId === user.id);
  
  // For communities - filter from savedCommunities (which includes both created and joined)
  const userCreatedCommunities = savedCommunities.filter(community => community.creatorId === user.id);
  const userJoinedCommunities = savedCommunities.filter(community => community.creatorId !== user.id && community.isMember);
  const allUserCommunities = [...userCreatedCommunities, ...userJoinedCommunities];
  
  // For study sessions - filter from savedSessions
  const userCreatedSessions = savedSessions.filter(session => session.hostId === user.id);
  const userJoinedSessions = savedSessions.filter(session => session.hostId !== user.id);
  const allUserSessions = [...userCreatedSessions, ...userJoinedSessions];
  
  // For infovids - filter from savedInfovids
  const userCreatedInfovids = savedInfovids.filter(infovid => infovid.creatorId === user.id);
  const userSavedInfovids = savedInfovids.filter(infovid => infovid.creatorId !== user.id);
  const allUserInfovids = [...userCreatedInfovids, ...userSavedInfovids];
  
  // For store - combine created courses and purchases
  const userCreatedCourses = savedCourses.filter(course => course.instructorId === user.id);
  const userPurchasedCourses = purchases;
  const allUserStore = [...userCreatedCourses, ...userPurchasedCourses];

  // Get latest 2 items for each section
  const recentNotes = userNotes.slice(0, 2);
  const recentSets = userFlipCardSets.slice(0, 2);
  const recentCommunities = allUserCommunities.slice(0, 2);
  const recentSessions = allUserSessions.slice(0, 2);
  const recentInfovids = allUserInfovids.slice(0, 2);
  const recentStore = allUserStore.slice(0, 2);

  const achievements = [
    { name: 'First Steps', description: 'Created your first account', icon: Target, earned: true },
    { name: 'Note Taker', description: 'Uploaded your first note', icon: FileText, earned: userNotes.length > 0 },
    { name: 'Card Creator', description: 'Created your first flip card set', icon: Brain, earned: userFlipCardSets.length > 0 },
    { name: 'Study Streak', description: 'Study for 7 days in a row', icon: TrendingUp, earned: false },
    { name: 'Social Learner', description: 'Connect with 5 study partners', icon: Users, earned: user.followers >= 5 },
    { name: 'Knowledge Sharer', description: 'Upload 10 notes', icon: FileText, earned: userNotes.length >= 10 },
    { name: 'Card Master', description: 'Create 5 flip card sets', icon: Brain, earned: userFlipCardSets.length >= 5 },
    { name: 'Course Collector', description: 'Purchase your first course', icon: ShoppingBag, earned: purchases.length > 0 },
    { name: 'Community Builder', description: 'Join 3 communities', icon: Users, earned: allUserCommunities.length >= 3 },
    { name: 'Session Host', description: 'Host your first study session', icon: Video, earned: userCreatedSessions.length > 0 },
  ];

  const displayedAchievements = showAllAchievements ? achievements : achievements.slice(0, 4);

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editData);
    }
    setIsEditing(false);
  };

  const handleProfilePictureUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (onUpdateProfile) {
            onUpdateProfile({ profilePicture: e.target?.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleFollowersClick = () => {
    setFollowersModalType('followers');
    setShowFollowersModal(true);
  };

  const handleFollowingClick = () => {
    setFollowersModalType('following');
    setShowFollowersModal(true);
  };

  const handleFollowToggle = (userId: string, action: 'follow' | 'unfollow' | 'followback') => {
    // Find the user to follow/unfollow
    const targetUser = followersModalType === 'followers' 
      ? followers.find(f => f.id === userId)
      : following.find(f => f.id === userId);
    
    if (targetUser) {
      if (action === 'follow') {
        onFollowUser(targetUser);
      } else if (action === 'unfollow') {
        onUnfollowUser(targetUser);
      } else if (action === 'followback') {
        onFollowBack(targetUser);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
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
            {i % 4 === 0 ? <FileText /> : 
             i % 4 === 1 ? <Brain /> : 
             i % 4 === 2 ? <Users /> : <Video />}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm shadow-lg">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <button 
                onClick={handleProfilePictureUpload}
                className="absolute -bottom-2 -right-2 p-2 bg-white text-gray-600 rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold bg-white bg-opacity-20 text-white placeholder-blue-100 border border-white border-opacity-30 rounded-xl px-4 py-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    placeholder="Your name"
                  />
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-white bg-opacity-20 text-white placeholder-blue-100 border border-white border-opacity-30 rounded-xl px-4 py-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 resize-none"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                  <input
                    type="text"
                    value={editData.education}
                    onChange={(e) => setEditData(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full bg-white bg-opacity-20 text-white placeholder-blue-100 border border-white border-opacity-30 rounded-xl px-4 py-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    placeholder="Your education (e.g., Computer Science at MIT)"
                  />
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-white bg-opacity-20 text-white placeholder-blue-100 border border-white border-opacity-30 rounded-xl px-4 py-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    placeholder="Your location"
                  />
                  <div className="flex items-center space-x-4">
                    <label className="text-white font-medium">Profile Visibility:</label>
                    <select
                      value={editData.profileVisibility}
                      onChange={(e) => setEditData(prev => ({ ...prev, profileVisibility: e.target.value as 'public' | 'private' }))}
                      className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-xl px-4 py-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    >
                      <option value="public" className="text-gray-900">Public</option>
                      <option value="private" className="text-gray-900">Private</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-white text-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-xl font-medium hover:bg-opacity-30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-4 mb-3">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center space-x-1 text-blue-100">
                      {user.profileVisibility === 'public' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span className="text-sm">{user.profileVisibility}</span>
                    </div>
                  </div>
                  <p className="text-blue-100 text-lg mb-2">{user.email}</p>
                  {user.education && (
                    <div className="flex items-center space-x-2 text-blue-100 mb-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{user.education}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center space-x-2 text-blue-100 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.bio && (
                    <p className="text-blue-100 mb-4">{user.bio}</p>
                  )}
                  <div className="flex items-center space-x-6 mb-4">
                    <button onClick={handleFollowersClick} className="text-center hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors">
                      <p className="text-2xl font-bold">{followers.length}</p>
                      <p className="text-blue-100 text-sm">Followers</p>
                    </button>
                    <button onClick={handleFollowingClick} className="text-center hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors">
                      <p className="text-2xl font-bold">{following.length}</p>
                      <p className="text-blue-100 text-sm">Following</p>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-4 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="#stats" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm font-medium hover:underline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Stats & Achievements
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href="#content" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm font-medium hover:underline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              My Content
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href="#activity" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm font-medium hover:underline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('activity')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Recent Activity
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Achievements */}
          <div id="stats" className="lg:col-span-1 space-y-6">
            {/* Study Stats */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Study Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Notes Uploaded</span>
                  <span className="font-semibold text-white">{userNotes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Flip Card Sets</span>
                  <span className="font-semibold text-white">{userFlipCardSets.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Cards</span>
                  <span className="font-semibold text-white">{totalCards}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Courses Purchased</span>
                  <span className="font-semibold text-white">{purchases.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Communities</span>
                  <span className="font-semibold text-white">{allUserCommunities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Study Sessions</span>
                  <span className="font-semibold text-white">{allUserSessions.length}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Achievements</span>
                </h3>
                {achievements.length > 4 && (
                  <button
                    onClick={() => setShowAllAchievements(!showAllAchievements)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showAllAchievements ? 'Show Less' : 'View All'}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {displayedAchievements.map((achievement) => (
                  <div
                    key={achievement.name}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-700' 
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-green-800' : 'bg-gray-700'
                    }`}>
                      <achievement.icon className={`w-4 h-4 ${
                        achievement.earned ? 'text-green-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        achievement.earned ? 'text-green-300' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </p>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-green-400' : 'text-gray-600'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Content Sections */}
          <div id="content" className="lg:col-span-2 space-y-6">
            {/* My Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* My Notes */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">My Notes</h3>
                  <button
                    onClick={() => onNavigate('notes')}
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                  >
                    <span className="text-sm">Manage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {recentNotes.length > 0 ? (
                  <div className="space-y-3">
                    {recentNotes.map((note) => (
                      <div key={note.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{note.title}</h4>
                          <p className="text-xs text-gray-400 line-clamp-1">{note.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No notes yet</p>
                  </div>
                )}
              </div>

              {/* My Flip Card Sets */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">My Flip Card Sets</h3>
                  <button
                    onClick={() => onNavigate('flipcards')}
                    className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1"
                  >
                    <span className="text-sm">Manage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {recentSets.length > 0 ? (
                  <div className="space-y-3">
                    {recentSets.map((set) => (
                      <div key={set.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{set.title}</h4>
                          <p className="text-xs text-gray-400">{set.cards.length} cards</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Brain className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No flip card sets yet</p>
                  </div>
                )}
              </div>

              {/* My Communities */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">My Communities</h3>
                  <button
                    onClick={() => onNavigate('communities')}
                    className="text-teal-400 hover:text-teal-300 transition-colors flex items-center space-x-1"
                  >
                    <span className="text-sm">Manage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {recentCommunities.length > 0 ? (
                  <div className="space-y-3">
                    {recentCommunities.map((community) => (
                      <div key={community.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                        <Users className="w-5 h-5 text-teal-400" />
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{community.name}</h4>
                          <p className="text-xs text-gray-400">
                            {community.memberCount} members
                            {community.creatorId === user.id && <span className="text-teal-400 ml-2">(Created)</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No communities joined yet</p>
                  </div>
                )}
              </div>

              {/* My Study Sessions */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">My Study Sessions</h3>
                  <button
                    onClick={() => onNavigate('study-sessions')}
                    className="text-green-400 hover:text-green-300 transition-colors flex items-center space-x-1"
                  >
                    <span className="text-sm">Manage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {recentSessions.length > 0 ? (
                  <div className="space-y-3">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{session.title}</h4>
                          <p className="text-xs text-gray-400">
                            {session.subject}
                            {session.hostId === user.id && <span className="text-green-400 ml-2">(Hosted)</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No study sessions yet</p>
                  </div>
                )}
              </div>

              {/* My Infovids */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">My Infovids</h3>
                  <button
                    onClick={() => onNavigate('infovids')}
                    className="text-pink-400 hover:text-pink-300 transition-colors flex items-center space-x-1"
                  >
                    <span className="text-sm">Manage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {recentInfovids.length > 0 ? (
                  <div className="space-y-3">
                    {recentInfovids.map((infovid) => (
                      <div key={infovid.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                        <Video className="w-5 h-5 text-pink-400" />
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{infovid.title}</h4>
                          <p className="text-xs text-gray-400">
                            {infovid.subject}
                            {infovid.creatorId === user.id && <span className="text-pink-400 ml-2">(Created)</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Video className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No infovids saved yet</p>
                  </div>
                )}
              </div>

              {/* My Store */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">My Store</h3>
                  <button
                    onClick={() => onNavigate('my-store')}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center space-x-1"
                  >
                    <span className="text-sm">Manage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {recentStore.length > 0 ? (
                  <div className="space-y-3">
                    {recentStore.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                        <ShoppingBag className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">
                            {item.courseName || item.title}
                          </h4>
                          <p className="text-xs text-gray-400">
                            ${item.amount || item.price} 
                            {item.courseName ? ' (Purchased)' : item.instructorId === user.id ? ' (Created)' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShoppingBag className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No courses purchased yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div id="activity" className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                {recentActivities.length > 0 && (
                  <button
                    onClick={onDeleteAllActivities}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {recentActivities.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentActivities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {activity.type === 'note_upload' && <FileText className="w-6 h-6 text-blue-400" />}
                          {activity.type === 'note_save' && <FileText className="w-6 h-6 text-blue-400" />}
                          {activity.type === 'flipcard_create' && <Brain className="w-6 h-6 text-purple-400" />}
                          {activity.type === 'flipcard_save' && <Brain className="w-6 h-6 text-purple-400" />}
                          {activity.type === 'community_join' && <Users className="w-6 h-6 text-teal-400" />}
                          {activity.type === 'session_join' && <Calendar className="w-6 h-6 text-green-400" />}
                          {activity.type === 'course_purchase' && <ShoppingBag className="w-6 h-6 text-yellow-400" />}
                          {activity.type === 'infovid_save' && <Video className="w-6 h-6 text-pink-400" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{activity.title}</h4>
                          <p className="text-sm text-gray-400">{activity.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => onDeleteActivity(activity.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Followers/Following Modal */}
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        type={followersModalType}
        users={followersModalType === 'followers' ? followers : following}
        currentUser={user}
        onFollowToggle={handleFollowToggle}
      />

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