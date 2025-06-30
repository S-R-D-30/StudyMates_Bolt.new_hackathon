import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, Plus, Search, User, BookOpen, Play, Globe, Lock, Eye, X, Trash2, Link } from 'lucide-react';
import type { StudySession, User as UserType } from '../../types';

interface StudySessionsProps {
  user: UserType;
  sessions?: StudySession[];
  onCreateSession?: (session: Omit<StudySession, 'id' | 'hostId' | 'participants' | 'isActive'>) => void;
  onDeleteSession?: (sessionId: string) => void;
}

/**
 * Study Session Preview Modal - Same design as other preview modals
 */
const StudySessionPreviewModal = ({ session, onClose, onJoinSession, onDeleteSession, user }) => {
  if (!session) return null;

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'session': return 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const handleCopyPrivateLink = () => {
    const privateLink = `${window.location.origin}/private/session/${session.id}`;
    navigator.clipboard.writeText(privateLink);
    alert('Private link copied to clipboard!');
  };

  const handleJoinMeeting = () => {
    if (session.meetingUrl) {
      window.open(session.meetingUrl, '_blank');
    } else {
      alert('Meeting link not available');
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
            {session.isActive ? (
              <Video className="w-8 h-8 text-green-400" />
            ) : (
              <Calendar className="w-8 h-8 text-blue-400" />
            )}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">{session.title}</h3>
            <span className={`font-medium ${session.isActive ? 'text-green-400' : 'text-blue-400'}`}>
              Study Session Preview
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Session thumbnail */}
          <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden">
            <img src={session.posterUrl || getDefaultThumbnail('session')} alt={session.title} className="w-full h-full object-cover" />
          </div>

          {/* Host and session info */}
          <div className="flex items-start space-x-3 text-gray-400">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              {session.hostProfilePicture ? (
                <img src={session.hostProfilePicture} alt={session.hostName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-500 m-2" />
              )}
            </div>
            <div>
              <p className="text-base font-medium text-gray-300">Hosted by {session.hostName}</p>
              <p className="text-xs text-gray-500">
                {new Date(session.scheduledTime).toLocaleDateString()} at {new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
            <p className="text-gray-300 leading-relaxed">{session.description}</p>
          </div>

          {/* Session details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span>Subject: {session.subject}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Duration: {session.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                {session.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{session.isPublic ? 'Public' : 'Private'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{session.participants.length}/{session.maxParticipants} participants</span>
              </div>
              {session.isActive && (
                <div className="flex items-center space-x-2 text-green-400">
                  <Video className="w-4 h-4" />
                  <span>Live Now</span>
                </div>
              )}
              {session.meetingUrl && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <Link className="w-4 h-4" />
                  <span>Meeting Link Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Participants */}
          <div>
            <h4 className="font-medium text-white mb-3">Participants</h4>
            <div className="space-y-2">
              {session.participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    {participant.profilePicture ? (
                      <img 
                        src={participant.profilePicture} 
                        alt={participant.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-300">{participant.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mt-4">
            {session.hostId === user.id && (
              <button
                onClick={() => onDeleteSession(session.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Session</span>
              </button>
            )}
            
            {!session.isPublic && (
              <button
                onClick={handleCopyPrivateLink}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Link className="w-5 h-5" />
                <span>Copy Private Link</span>
              </button>
            )}
            
            {session.meetingUrl ? (
              <button
                onClick={handleJoinMeeting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Join Meeting</span>
              </button>
            ) : (
              <button
                onClick={() => onJoinSession(session.id)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Join Session</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudySessions({ user, sessions = [], onCreateSession, onDeleteSession }: StudySessionsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSession, setPreviewSession] = useState<StudySession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hosting' | 'joined'>('all');
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    subject: '',
    date: '',
    time: '',
    duration: 90,
    maxParticipants: 8,
    isPublic: true,
    tags: '',
    meetingUrl: ''
  });

  // Filter sessions based on the selected filter type and search query
  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'hosting' && session.hostId === user.id) ||
                         (filterType === 'joined' && session.hostId !== user.id);
    
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleJoinSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      if (session.meetingUrl) {
        window.open(session.meetingUrl, '_blank');
      } else {
        // Check if user is already a participant
        const isAlreadyParticipant = session.participants.some(p => p.id === user.id);
        
        if (!isAlreadyParticipant && session.participants.length < session.maxParticipants) {
          console.log('Joining session:', sessionId);
          alert(`You have joined "${session.title}"! Check your dashboard for updates.`);
        } else if (isAlreadyParticipant) {
          alert('You are already a participant in this session.');
        } else {
          alert('This session is full.');
        }
      }
    }
  };

  const handleStartSession = (session: StudySession) => {
    if (session.meetingUrl) {
      window.open(session.meetingUrl, '_blank');
    }
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time into a single ISO string
    const scheduledTime = new Date(`${createData.date}T${createData.time}`).toISOString();
    
    const newSession = {
      title: createData.title,
      description: createData.description,
      hostName: user.name,
      hostProfilePicture: user.profilePicture,
      scheduledTime,
      duration: createData.duration,
      maxParticipants: createData.maxParticipants,
      subject: createData.subject,
      isPublic: createData.isPublic,
      tags: createData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      meetingUrl: createData.meetingUrl || undefined
    };
    
    if (onCreateSession) {
      onCreateSession(newSession);
    }
    
    console.log('Creating session:', newSession);
    setShowCreateModal(false);
    setCreateData({
      title: '',
      description: '',
      subject: '',
      date: '',
      time: '',
      duration: 90,
      maxParticipants: 8,
      isPublic: true,
      tags: '',
      meetingUrl: ''
    });
  };

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'session': return 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Study Sessions</h2>
            <p className="text-gray-400">Join or create collaborative study sessions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Session</span>
          </button>
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
                placeholder="Search study sessions by title, subject, or description..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'hosting' | 'joined')}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Sessions</option>
                <option value="hosting">Hosting</option>
                <option value="joined">Joined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions Grid - Updated to match consistent card design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
                <img src={session.posterUrl || getDefaultThumbnail('session')} alt={session.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                {session.isActive && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                    Live
                  </div>
                )}
                {(session as any).isNotified && !session.isActive && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                    Notify Set
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                  {session.duration}m
                </div>
              </div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {session.isActive ? (
                    <Video className="w-5 h-5 text-green-400" />
                  ) : (
                    <Calendar className="w-5 h-5 text-blue-400" />
                  )}
                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                    {session.title}
                  </h4>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewSession(session);
                      setShowPreviewModal(true);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {session.hostId === user.id && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (onDeleteSession) onDeleteSession(session.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {session.isPublic ? (
                    <Globe className="w-4 h-4 text-green-500 p-1" />
                  ) : (
                    <Lock className="w-4 h-4 text-yellow-500 p-1" />
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{session.description}</p>

              {/* Host & Participants info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    {session.hostProfilePicture ? (
                      <img src={session.hostProfilePicture} alt={session.hostName} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{session.hostId === user.id ? 'Hosted by you' : session.hostName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{session.participants.length}/{session.maxParticipants}</span>
                </div>
              </div>

              {/* Session time */}
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(session.scheduledTime).toLocaleDateString()} at {new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Action Button */}
              {session.meetingUrl ? (
                <button
                  onClick={() => handleJoinSession(session.id)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Play className="w-4 h-4" />
                  <span>Join Meeting</span>
                </button>
              ) : session.isActive ? (
                <button
                  onClick={() => handleStartSession(session)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Play className="w-4 h-4" />
                  <span>Join Now</span>
                </button>
              ) : (
                <button
                  onClick={() => handleJoinSession(session.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Join Session</span>
                </button>
              )}
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {filterType === 'hosting' ? 'You\'re not hosting any sessions yet' :
                 filterType === 'joined' ? 'You haven\'t joined any sessions yet' :
                 'No study sessions found'}
              </h3>
              <p className="text-gray-400 mb-6">
                {filterType === 'hosting' ? 'Create your first study session to help others learn' :
                 filterType === 'joined' ? 'Join a session to collaborate with other students' :
                 'Create or join a study session to get started'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create Study Session</span>
              </button>
            </div>
          )}
        </div>

        {/* Create Session Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Create Study Session</h3>
              
              <form onSubmit={handleCreateSession} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Session Title
                  </label>
                  <input
                    type="text"
                    value={createData.title}
                    onChange={(e) => setCreateData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Enter session title"
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
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
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={createData.description}
                    onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Describe what you'll be studying"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={createData.meetingUrl}
                    onChange={(e) => setCreateData(prev => ({ ...prev, meetingUrl: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="https://meet.google.com/your-meeting-link"
                  />
                  <p className="text-xs text-gray-500 mt-1">Add your Google Meet, Zoom, or other meeting link</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={createData.date}
                      onChange={(e) => setCreateData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={createData.time}
                      onChange={(e) => setCreateData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="300"
                      step="30"
                      value={createData.duration}
                      onChange={(e) => setCreateData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="20"
                      value={createData.maxParticipants}
                      onChange={(e) => setCreateData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={createData.tags}
                    onChange={(e) => setCreateData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="e.g. calculus, study-group"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={createData.isPublic}
                    onChange={(e) => setCreateData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-300 flex items-center space-x-2">
                    {createData.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>Make this session {createData.isPublic ? 'public (anyone can join)' : 'private (invite-only)'}</span>
                  </label>
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
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg"
                  >
                    Create Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Session Preview Modal */}
        {showPreviewModal && previewSession && (
          <StudySessionPreviewModal
            session={previewSession}
            user={user}
            onClose={() => {
              setShowPreviewModal(false);
              setPreviewSession(null);
            }}
            onJoinSession={handleJoinSession}
            onDeleteSession={onDeleteSession}
          />
        )}
      </div>
    </div>
  );
}