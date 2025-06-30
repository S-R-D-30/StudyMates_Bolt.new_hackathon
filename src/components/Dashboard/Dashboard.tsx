import React, { useState } from 'react';
import { Upload, FileText, Brain, User, TrendingUp, Users, Send, UserPlus, Share2, Calendar, Video, Search } from 'lucide-react';
import type { User as UserType, Note, FlipCardSet, Post, RecentActivity } from '../../types';

interface DashboardProps {
  user: UserType;
  notes: Note[];
  flipCardSets: FlipCardSet[];
  posts: Post[];
  recentActivities: RecentActivity[];
  onNavigate: (view: string) => void;
  onCreatePost: (content: string) => void;
  onDeleteActivity: (activityId: string) => void;
  onDeleteAllActivities: () => void;
}

export default function Dashboard({ 
  user, 
  notes, 
  flipCardSets, 
  posts, 
  recentActivities,
  onNavigate, 
  onCreatePost,
  onDeleteActivity,
  onDeleteAllActivities
}: DashboardProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const stats = [
    { name: 'Notes Uploaded', value: notes.length, icon: FileText, color: 'from-blue-500 to-blue-600', action: () => onNavigate('notes') },
    { name: 'Flip Card Sets', value: flipCardSets.length, icon: Brain, color: 'from-purple-500 to-purple-600', action: () => onNavigate('flipcards') },
    { name: 'Study Sessions', value: 12, icon: Calendar, color: 'from-green-500 to-green-600', action: () => onNavigate('study-sessions') },
  ];

  const quickActions = [
    {
      title: 'Upload Notes',
      description: 'Add your study materials and let AI help organize them',
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
      action: () => onNavigate('notes')
    },
    {
      title: 'Create Flip Cards',
      description: 'Generate AI-powered flashcards from your notes',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      action: () => onNavigate('flipcards')
    },
    {
      title: 'Join Communities',
      description: 'Connect with study groups and subject communities',
      icon: Users,
      color: 'from-teal-500 to-teal-600',
      action: () => onNavigate('communities')
    },
    {
      title: 'Watch Infovids',
      description: 'Learn from educational videos and tutorials',
      icon: Video,
      color: 'from-pink-500 to-pink-600',
      action: () => onNavigate('reels')
    },
    {
      title: 'Study Sessions',
      description: 'Join or create collaborative study sessions',
      icon: Calendar,
      color: 'from-indigo-500 to-indigo-600',
      action: () => onNavigate('study-sessions')
    }
  ];

  const inviteText = `🎓 Join me on StudyMates - the ultimate learning platform for students! 

✨ Upload notes, create AI flashcards, and study together
🤝 Connect with study partners in your area
📚 Make learning collaborative and fun

Join now: [Your Referral Link]

#StudyMates #Learning #Students`;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
              <p className="text-blue-100 text-lg">Ready to supercharge your learning today?</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Invite Friends</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <button
              key={stat.name}
              onClick={stat.action}
              className="bg-gray-900 hover:bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-sm transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={action.action}
                className="bg-gray-900 hover:bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-sm transition-all duration-200 transform hover:scale-[1.02] text-left group"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{action.title}</h4>
                <p className="text-gray-400">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            {recentActivities.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={onDeleteAllActivities}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {recentActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === 'note_upload' && <FileText className="w-8 h-8 text-blue-400" />}
                    {activity.type === 'flipcard_create' && <Brain className="w-8 h-8 text-purple-400" />}
                    {activity.type === 'community_join' && <Users className="w-8 h-8 text-teal-400" />}
                    {activity.type === 'session_join' && <Calendar className="w-8 h-8 text-green-400" />}
                    {activity.type === 'course_purchase' && <Video className="w-8 h-8 text-yellow-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => onDeleteActivity(activity.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            
            {recentActivities.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity. Start by uploading your first study material!</p>
              </div>
            )}
          </div>
        </div>

        {/* Invite Friends Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Invite Friends to StudyMates</h3>
              
              <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
                <textarea
                  value={inviteText}
                  readOnly
                  className="w-full bg-transparent text-sm text-gray-300 resize-none border-none focus:outline-none"
                  rows={8}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteText);
                    setShowInviteModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Copy & Share</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}