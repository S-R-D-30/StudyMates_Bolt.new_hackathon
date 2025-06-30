import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, Plus, Search, User, BookOpen, Play, Globe, Lock, Eye, Bell, Filter } from 'lucide-react';
import type { StudySession, User as UserType } from '../../types';

interface PublicStudySessionsProps {
  onNavigate: (view: string) => void;
  user: UserType | null; // User can be null if not logged in
  onAddNotification?: (notification: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string; }) => void;
  isLoggedIn: boolean;
}

export default function PublicStudySessions({ onNavigate, user, onAddNotification, isLoggedIn }: PublicStudySessionsProps) {
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Sample public study sessions data
  const sampleSessions: StudySession[] = [
    {
      id: '1',
      title: 'Calculus Study Group',
      description: 'Working through derivatives and integrals. Bring your questions!',
      hostId: '2',
      hostName: 'Sarah Johnson',
      hostProfilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      participants: [
        { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', followers: 156, following: 89, profileVisibility: 'public', joinDate: '2024-01-10T00:00:00Z' },
        { id: '3', name: 'Mike Chen', email: 'mike@example.com', followers: 203, following: 145, profileVisibility: 'public', joinDate: '2024-01-05T00:00:00Z' }
      ],
      scheduledTime: '2025-07-01T19:00:00Z',
      duration: 120,
      isActive: false,
      maxParticipants: 8,
      subject: 'Mathematics',
      meetingUrl: 'https://meet.example.com/calculus-study',
      isPublic: true,
      tags: ['calculus', 'mathematics'],
      posterUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Physics Problem Solving',
      description: 'Live Q&A to clarify concepts on quantum mechanics and wave theory.',
      hostId: '4',
      hostName: 'Emma Davis',
      hostProfilePicture: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
      participants: [
        { id: '4', name: 'Emma Davis', email: 'emma@example.com', followers: 89, following: 67, profileVisibility: 'public', joinDate: '2024-01-15T00:00:00Z' }
      ],
      scheduledTime: '2025-06-27T15:30:00Z',
      duration: 90,
      isActive: true,
      maxParticipants: 6,
      subject: 'Physics',
      meetingUrl: 'https://meet.example.com/physics-qa',
      isPublic: true,
      tags: ['physics', 'quantum'],
      posterUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Chemistry Lab Techniques',
      description: 'Discussing safe and effective lab practices for organic chemistry.',
      hostId: '5',
      hostName: 'Leo Varghese',
      hostProfilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      participants: [],
      scheduledTime: '2025-07-02T11:00:00Z',
      duration: 60,
      isActive: false,
      maxParticipants: 10,
      subject: 'Chemistry',
      meetingUrl: 'https://meet.example.com/chem-lab',
      isPublic: true,
      tags: ['chemistry', 'lab', 'organic'],
      posterUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      title: 'Programming Workshop',
      description: 'Practice coding interview questions on arrays and linked lists.',
      hostId: '6',
      hostName: 'Mike Chen',
      participants: [],
      scheduledTime: '2025-07-05T20:00:00Z',
      duration: 120,
      isActive: false,
      maxParticipants: 15,
      subject: 'Computer Science',
      meetingUrl: 'https://meet.example.com/coding-workshop',
      isPublic: true,
      tags: ['computer-science', 'algorithms'],
      posterUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filteredSessions = sampleSessions.filter(session => {
    const matchesSearch = session.isPublic && (
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const matchesSubject = filterSubject === 'all' || session.subject.toLowerCase() === filterSubject.toLowerCase();
    
    return matchesSearch && matchesSubject;
  });

  const handleJoinSession = (session: StudySession) => {
    // Check if the user is logged in
    if (!isLoggedIn) {
      if (onAddNotification) {
        onAddNotification({
          type: 'warning',
          title: 'Login Required',
          message: 'You must be logged in to join a session.'
        });
      }
      // In a real app, you would redirect to the login page or show a login modal
      onNavigate('login');
      return;
    }
    
    // If the session has a meeting URL, open it
    if (session.meetingUrl) {
      window.open(session.meetingUrl, '_blank');
    } else {
      // Placeholder logic for joining
      console.log('Joining session:', session.id);
      if (onAddNotification) {
        onAddNotification({
          type: 'success',
          title: 'Session Joined',
          message: 'You have successfully joined the session!'
        });
      }
    }
  };

  const handleStartSession = (session: StudySession) => {
    if (!isLoggedIn) {
      if (onAddNotification) {
        onAddNotification({
          type: 'warning',
          title: 'Login Required',
          message: 'You must be logged in to join a session.'
        });
      }
      onNavigate('login');
      return;
    }
    
    if (session.meetingUrl) {
      window.open(session.meetingUrl, '_blank');
    } else {
      if (onAddNotification) {
        onAddNotification({
          type: 'error',
          title: 'Meeting Unavailable',
          message: 'Meeting link is not available yet.'
        });
      }
    }
  };

  const handleNotifySession = (sessionId: string) => {
    if (!isLoggedIn) {
      if (onAddNotification) {
        onAddNotification({
          type: 'warning',
          title: 'Login Required',
          message: 'You must be logged in to get notifications.'
        });
      }
      onNavigate('login');
      return;
    }
    
    console.log('Setting notification for session:', sessionId);
    if (onAddNotification) {
      onAddNotification({
        type: 'info',
        title: 'Notification Set',
        message: 'You will be notified when the session starts!'
      });
    }
  };

  // ----- SESSION DETAILS MODAL VIEW -----
  if (selectedSession) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
        <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 max-w-3xl w-full shadow-2xl transform scale-95 animate-fade-in-up">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setSelectedSession(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <h3 className="text-3xl font-bold text-white mb-4">{selectedSession.title}</h3>
          
          <div className="space-y-6 mb-8">
            <p className="text-gray-300 text-lg leading-relaxed">{selectedSession.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-400">
                  <User className="w-6 h-6 text-blue-400" />
                  <div>
                    <span className="font-medium">Hosted by:</span>
                    <p className="text-white font-semibold">{selectedSession.hostName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  <div>
                    <span className="font-medium">Subject:</span>
                    <p className="text-white font-semibold">{selectedSession.subject}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  {selectedSession.isPublic ? (
                    <Globe className="w-6 h-6 text-green-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-yellow-400" />
                  )}
                  <div>
                    <span className="font-medium">Visibility:</span>
                    <p className="text-white font-semibold">{selectedSession.isPublic ? 'Public' : 'Private'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Calendar className="w-6 h-6 text-orange-400" />
                  <div>
                    <span className="font-medium">Date:</span>
                    <p className="text-white font-semibold">{new Date(selectedSession.scheduledTime).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <div>
                    <span className="font-medium">Time:</span>
                    <p className="text-white font-semibold">
                      {new Date(selectedSession.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({selectedSession.duration} min)
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Users className="w-6 h-6 text-pink-400" />
                  <div>
                    <span className="font-medium">Attendees:</span>
                    <p className="text-white font-semibold">{selectedSession.participants.length}/{selectedSession.maxParticipants}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Participants */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-300 mb-3">Who's joining:</h4>
              <div className="flex flex-wrap gap-3">
                {selectedSession.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-2 bg-gray-800 rounded-full pr-4 py-2 pl-2 border border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
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
                    <span className="text-gray-200 text-sm">{participant.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedSession(null)}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Close
            </button>
            {selectedSession.isActive ? (
              <button
                onClick={() => handleStartSession(selectedSession)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Join Live Session</span>
              </button>
            ) : (
              <button
                onClick={() => handleJoinSession(selectedSession)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                Join Session
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----- MAIN VIEW: LIST OF ALL PUBLIC SESSIONS -----
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Public Study Sessions</h2>
            <p className="text-gray-400">Discover and join upcoming or live study sessions</p>
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
                placeholder="Search study sessions by title, subject, or tags..."
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

        {/* Sessions Grid - Matching the image design exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
                <img src={session.posterUrl} alt={session.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
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
                      setSelectedSession(session);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {session.isActive ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleStartSession(session);
                      }}
                      className="p-1 text-green-400 hover:text-green-300 transition-colors"
                      title="Join Live Session"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleNotifySession(session.id);
                      }}
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Get Notified"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{session.description}</p>

              {/* Host & Duration info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    {session.hostProfilePicture ? (
                      <img src={session.hostProfilePicture} alt={session.hostName} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{session.hostName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{session.duration}m</span>
                </div>
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No public study sessions found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}