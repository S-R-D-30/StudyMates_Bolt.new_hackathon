import React, { useState } from 'react';
import { Search, User, UserPlus, UserCheck, MapPin, GraduationCap, Filter, Eye, ArrowLeft, BookOpen, Brain, Calendar, Video, ShoppingBag, X, RefreshCw, Save, UserMinus } from 'lucide-react';
import type { User as UserType, Note, FlipCardSet, Community, Course } from '../../types';

interface ExploreProps {
  currentUser: UserType;
  isLoggedIn: boolean;
  onFollowUser: (user: UserType) => void;
  onUnfollowUser: (user: UserType) => void;
  onSaveNote: (noteId: string) => void;
  onSaveFlipCard: (setId: string) => void;
  onJoinCommunity: (communityId: string) => void;
  onPurchaseCourse: (courseId: string) => void;
  onAddNotification?: (notification: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string; }) => void;
}

/**
 * User Profile Preview Modal - Shows another user's profile
 */
const UserProfileModal = ({ 
  user, 
  onClose, 
  onFollowToggle, 
  currentUser, 
  isLoggedIn,
  onSaveNote,
  onSaveFlipCard,
  onJoinCommunity,
  onPurchaseCourse
}) => {
  if (!user) return null;

  // Sample data for the viewed user's content
  const userNotes = [
    {
      id: '1',
      title: 'Introduction to Calculus',
      subject: 'Mathematics',
    },
    {
      id: '2',
      title: 'Quantum Physics Basics',
      subject: 'Physics',
    }
  ];

  const userFlipCardSets = [
    {
      id: '1',
      title: 'Calculus Formulas',
      cards: 12,
    },
    {
      id: '2',
      title: 'Physics Equations',
      cards: 8,
    }
  ];

  const userCommunities = [
    {
      id: '1',
      name: 'Mathematics Hub',
      members: 1247,
    },
    {
      id: '2',
      name: 'Physics Phenomena',
      members: 634,
    }
  ];

  const userCourses = [
    {
      id: '1',
      title: 'Advanced Calculus',
      price: 49.99,
    },
    {
      id: '2',
      title: 'Quantum Mechanics',
      price: 59.99,
    }
  ];

  // Check if profile is private
  const isProfilePrivate = user.profileVisibility === 'private';

  const handleSaveNote = (noteId) => {
    if (isLoggedIn) {
      onSaveNote(noteId);
    } else {
      alert('Please log in to save notes');
    }
  };

  const handleSaveFlipCard = (setId) => {
    if (isLoggedIn) {
      onSaveFlipCard(setId);
    } else {
      alert('Please log in to save flip card sets');
    }
  };

  const handleJoinCommunity = (communityId) => {
    if (isLoggedIn) {
      onJoinCommunity(communityId);
    } else {
      alert('Please log in to join communities');
    }
  };

  const handlePurchaseCourse = (courseId) => {
    if (isLoggedIn) {
      onPurchaseCourse(courseId);
    } else {
      alert('Please log in to purchase courses');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full p-8 shadow-2xl border border-gray-700 relative m-auto max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

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
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div>
                <div className="flex items-center space-x-4 mb-3">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                </div>
                <p className="text-blue-100 text-lg mb-2">{user.email}</p>
                
                {!isProfilePrivate && (
                  <>
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
                  </>
                )}
                
                <div className="flex items-center space-x-6 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user.followers}</p>
                    <p className="text-blue-100 text-sm">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user.following}</p>
                    <p className="text-blue-100 text-sm">Following</p>
                  </div>
                </div>
                
                <button
                  onClick={() => onFollowToggle(user.id, user.isFollowing ? 'unfollow' : 'follow')}
                  className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    user.isFollowing
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  {user.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isProfilePrivate ? (
          <div className="text-center py-12">
            <div className="bg-gray-700 p-8 rounded-xl inline-block mb-4">
              <Eye className="w-16 h-16 text-gray-500 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">This profile is private</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Follow {user.name} to see their profile information, notes, flip cards, and other content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User's Notes */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
                Notes
              </h3>
              {userNotes.length > 0 ? (
                <div className="space-y-3">
                  {userNotes.map((note) => (
                    <div key={note.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{note.title}</h4>
                        <p className="text-xs text-gray-400">{note.subject}</p>
                      </div>
                      <button 
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        onClick={() => handleSaveNote(note.id)}
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No notes shared</p>
                </div>
              )}
            </div>

            {/* User's Flip Card Sets */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 text-purple-400 mr-2" />
                Flip Card Sets
              </h3>
              {userFlipCardSets.length > 0 ? (
                <div className="space-y-3">
                  {userFlipCardSets.map((set) => (
                    <div key={set.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{set.title}</h4>
                        <p className="text-xs text-gray-400">{set.cards} cards</p>
                      </div>
                      <button 
                        className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                        onClick={() => handleSaveFlipCard(set.id)}
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Brain className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No flip card sets shared</p>
                </div>
              )}
            </div>

            {/* User's Communities */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 text-teal-400 mr-2" />
                Communities
              </h3>
              {userCommunities.length > 0 ? (
                <div className="space-y-3">
                  {userCommunities.map((community) => (
                    <div key={community.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                      <User className="w-5 h-5 text-teal-400" />
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{community.name}</h4>
                        <p className="text-xs text-gray-400">{community.members} members</p>
                      </div>
                      <button 
                        className="p-1 text-gray-400 hover:text-teal-400 transition-colors"
                        onClick={() => handleJoinCommunity(community.id)}
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <User className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No communities joined</p>
                </div>
              )}
            </div>

            {/* User's Courses */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 text-yellow-400 mr-2" />
                Courses & Resources
              </h3>
              {userCourses.length > 0 ? (
                <div className="space-y-3">
                  {userCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                      <ShoppingBag className="w-5 h-5 text-yellow-400" />
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{course.title}</h4>
                        <p className="text-xs text-gray-400">${course.price}</p>
                      </div>
                      <button 
                        className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                        onClick={() => handlePurchaseCourse(course.id)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ShoppingBag className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No courses available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Explore({ 
  currentUser, 
  isLoggedIn,
  onFollowUser,
  onUnfollowUser,
  onSaveNote,
  onSaveFlipCard,
  onJoinCommunity,
  onPurchaseCourse,
  onAddNotification
}: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'students' | 'educators'>('all');

  // Sample users data - only showing users the current user doesn't follow
  const [sampleUsers, setSampleUsers] = useState<UserType[]>([
    {
      id: '5',
      name: 'Alex Rodriguez',
      email: 'alex@example.com',
      bio: 'Chemistry student, future researcher',
      education: 'Chemistry at UC Berkeley',
      location: 'Berkeley, CA',
      followers: 134,
      following: 98,
      profileVisibility: 'public',
      joinDate: '2024-01-08T00:00:00Z',
      isFollowing: false
    },
    {
      id: '6',
      name: 'Dr. Lisa Wang',
      email: 'lisa@example.com',
      profilePicture: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Professor of Biology, passionate educator',
      education: 'Biology Professor at Harvard',
      location: 'Cambridge, MA',
      followers: 567,
      following: 234,
      profileVisibility: 'public',
      joinDate: '2023-12-01T00:00:00Z',
      isFollowing: false
    },
    {
      id: '7',
      name: 'James Wilson',
      email: 'james@example.com',
      profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Computer Engineering student, interested in robotics',
      education: 'Computer Engineering at Georgia Tech',
      location: 'Atlanta, GA',
      followers: 78,
      following: 102,
      profileVisibility: 'private',
      joinDate: '2024-01-03T00:00:00Z',
      isFollowing: false
    },
    {
      id: '8',
      name: 'Olivia Martinez',
      email: 'olivia@example.com',
      profilePicture: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Psychology major focusing on cognitive development',
      education: 'Psychology at UCLA',
      location: 'Los Angeles, CA',
      followers: 245,
      following: 187,
      profileVisibility: 'public',
      joinDate: '2023-12-15T00:00:00Z',
      isFollowing: false
    }
  ]);

  // Additional users for refresh functionality
  const additionalUsers: UserType[] = [
    {
      id: '9',
      name: 'David Johnson',
      email: 'david@example.com',
      profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Engineering student with a passion for sustainable design',
      education: 'Mechanical Engineering at Stanford',
      location: 'Palo Alto, CA',
      followers: 112,
      following: 87,
      profileVisibility: 'public',
      joinDate: '2024-01-20T00:00:00Z',
      isFollowing: false
    },
    {
      id: '10',
      name: 'Sophia Lee',
      email: 'sophia@example.com',
      profilePicture: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Art history major with a minor in digital media',
      education: 'Art History at NYU',
      location: 'New York, NY',
      followers: 189,
      following: 156,
      profileVisibility: 'public',
      joinDate: '2024-01-15T00:00:00Z',
      isFollowing: false
    },
    {
      id: '11',
      name: 'Marcus Brown',
      email: 'marcus@example.com',
      bio: 'Economics student researching cryptocurrency markets',
      education: 'Economics at University of Chicago',
      location: 'Chicago, IL',
      followers: 76,
      following: 92,
      profileVisibility: 'public',
      joinDate: '2024-01-10T00:00:00Z',
      isFollowing: false
    },
    {
      id: '12',
      name: 'Dr. Rachel Kim',
      email: 'rachel@example.com',
      profilePicture: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Professor of Computer Science specializing in AI',
      education: 'Computer Science Professor at MIT',
      location: 'Cambridge, MA',
      followers: 423,
      following: 112,
      profileVisibility: 'public',
      joinDate: '2023-11-15T00:00:00Z',
      isFollowing: false
    }
  ];

  const filteredUsers = sampleUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.education?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'educators') {
      return matchesSearch && (user.education?.includes('Professor') || user.education?.includes('PhD'));
    }
    if (filterType === 'students') {
      return matchesSearch && !user.education?.includes('Professor');
    }
    return matchesSearch;
  });

  const handleFollowToggle = (userId: string, action: 'follow' | 'unfollow') => {
    if (!isLoggedIn) {
      if (onAddNotification) {
        onAddNotification({
          type: 'warning',
          title: 'Login Required',
          message: 'Please log in to follow users'
        });
      }
      return;
    }
    
    // Update the isFollowing status in the local state
    setSampleUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: action === 'follow' } 
          : user
      )
    );

    // Find the user to follow/unfollow
    const userToToggle = sampleUsers.find(user => user.id === userId);
    if (userToToggle) {
      if (action === 'follow') {
        onFollowUser(userToToggle);
      } else {
        onUnfollowUser(userToToggle);
      }
    }
  };

  const handleViewProfile = (user: UserType) => {
    setSelectedUser(user);
  };

  const handleRefreshUsers = () => {
    // Shuffle and replace some users to simulate refresh
    const shuffledAdditional = [...additionalUsers].sort(() => 0.5 - Math.random());
    const currentIds = new Set(sampleUsers.map(user => user.id));
    
    // Keep some existing users and add some new ones
    const keptUsers = sampleUsers.slice(0, Math.floor(sampleUsers.length / 2));
    const newUsers = shuffledAdditional.filter(user => !currentIds.has(user.id)).slice(0, Math.ceil(sampleUsers.length / 2));
    
    setSampleUsers([...keptUsers, ...newUsers]);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Login to Explore</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to explore other users.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Explore StudyMates</h2>
            <p className="text-gray-400">Discover and connect with fellow learners</p>
          </div>
          <button
            onClick={handleRefreshUsers}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
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
                placeholder="Search by name, bio, or education..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'students' | 'educators')}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Users</option>
                <option value="students">Students</option>
                <option value="educators">Educators</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-200 group">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{user.bio}</p>
              )}

              {/* Education & Location */}
              <div className="space-y-2 mb-4">
                {user.education && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <GraduationCap className="w-4 h-4" />
                    <span className="line-clamp-1">{user.education}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                <div>
                  <span className="font-medium text-white">{user.followers}</span> followers
                </div>
                <div>
                  <span className="font-medium text-white">{user.following}</span> following
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewProfile(user)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => handleFollowToggle(user.id, user.isFollowing ? 'unfollow' : 'follow')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                    user.isFollowing 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                  }`}
                >
                  {user.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
              <p className="text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {/* User Profile Modal */}
        {selectedUser && (
          <UserProfileModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onFollowToggle={handleFollowToggle}
            currentUser={currentUser}
            isLoggedIn={isLoggedIn}
            onSaveNote={onSaveNote}
            onSaveFlipCard={onSaveFlipCard}
            onJoinCommunity={onJoinCommunity}
            onPurchaseCourse={onPurchaseCourse}
          />
        )}
      </div>
    </div>
  );
}