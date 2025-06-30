import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Paperclip, User, ArrowLeft, Search, Users, FileText, BookOpen, ScrollText } from 'lucide-react';
import type { Chat, ChatMessage, User as UserType, Note, FlipCardSet, Community } from '../../types';

// Helper component for animated background icons
const AnimatedBackground = () => (
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
        {i % 4 === 0 ? <MessageCircle /> :
         i % 4 === 1 ? <Users /> :
         i % 4 === 2 ? <User /> : <Send />}
      </div>
    ))}
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

// Helper component for Chat Header
interface ChatHeaderProps {
  otherParticipant: UserType | undefined;
  onBack: () => void;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({ otherParticipant, onBack }) => (
  <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center space-x-4 rounded-t-2xl shadow-sm">
    <button
      onClick={onBack}
      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 md:hidden"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-sm overflow-hidden">
        {otherParticipant?.profilePicture ? (
          <img
            src={otherParticipant.profilePicture}
            alt={otherParticipant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-white">{otherParticipant?.name || 'Unknown User'}</h3>
        <p className="text-sm text-green-400">Online</p>
      </div>
    </div>
  </div>
);

// Helper component for individual message bubbles
interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => (
  <div
    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
  >
    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
      isCurrentUser
        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
        : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 shadow-sm border border-gray-700'
    }`}>
      <p className="text-sm">{message.content}</p>

      {message.attachedResource && (
        <div className={`mt-3 p-3 rounded-xl border ${
          isCurrentUser
            ? 'bg-white bg-opacity-20 border-white border-opacity-30'
            : 'bg-gray-700 border-gray-600'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded ${
              isCurrentUser ? 'bg-white bg-opacity-30' : 'bg-blue-600'
            }`}>
              {message.attachedResource.type === 'note' ? (
                <FileText className={`w-3 h-3 ${isCurrentUser ? 'text-white' : 'text-white'}`} />
              ) : ( // Assuming 'flipcard' for anything else
                <BookOpen className={`w-3 h-3 ${isCurrentUser ? 'text-white' : 'text-white'}`} />
              )}
            </div>
            <span className={`text-xs font-medium ${
              isCurrentUser ? 'text-white' : 'text-gray-200'
            }`}>
              {message.attachedResource.title}
            </span>
          </div>
        </div>
      )}

      <p className={`text-xs mt-2 ${
        isCurrentUser ? 'text-blue-100' : 'text-gray-400'
      }`}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
);

// Helper component for Resource Sharing Modal
interface ResourceModalProps {
  notes: Note[];
  flipCardSets: FlipCardSet[];
  onAttach: (resource: Note | FlipCardSet, type: 'note' | 'flipcard') => void;
  onClose: () => void;
}
const ResourceModal: React.FC<ResourceModalProps> = ({ notes, flipCardSets, onAttach, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6">Share Resource</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-white mb-3">My Notes</h4>
          <div className="space-y-2">
            {notes.length > 0 ? (
              notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => onAttach(note, 'note')}
                  className="w-full p-3 text-left bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700"
                >
                  <p className="font-medium text-white">{note.title}</p>
                  <p className="text-sm text-gray-400">{note.summary}</p>
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No notes available.</p>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">My Flip Cards</h4>
          <div className="space-y-2">
            {flipCardSets.length > 0 ? (
              flipCardSets.map((set) => (
                <button
                  key={set.id}
                  onClick={() => onAttach(set, 'flipcard')}
                  className="w-full p-3 text-left bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700"
                >
                  <p className="font-medium text-white">{set.title}</p>
                  <p className="text-sm text-gray-400">{set.cards.length} cards</p>
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No flip cards available.</p>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full mt-6 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
);

// Helper component for the header of the chat list view
interface ChatListHeaderProps {
  // Removed onNewChat prop since we're removing the New Chat button
}
const ChatListHeader: React.FC<ChatListHeaderProps> = () => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Messages</h2>
      <p className="text-gray-400">Connect with study partners and communities</p>
    </div>
  </div>
);

// Helper component for the "People" tab content
interface PeopleTabProps {
  followingUsers: UserType[];
  onCreateChat: (userId: string) => void;
  onSelectChat: (chatId: string) => void;
  chats: Chat[];
  user: UserType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
const PeopleTab: React.FC<PeopleTabProps> = ({ followingUsers, onCreateChat, onSelectChat, chats, user, searchQuery, onSearchChange }) => {
  const getChatIdForUser = (targetUserId: string) => {
    const existingChat = chats.find(chat =>
      chat.participants.length === 2 &&
      chat.participants.some(p => p.id === user.id) &&
      chat.participants.some(p => p.id === targetUserId)
    );
    return existingChat ? existingChat.id : null;
  };

  const handleUserClick = (person: UserType) => {
    const existingChatId = getChatIdForUser(person.id);
    if (existingChatId) {
      onSelectChat(existingChatId);
    } else {
      onCreateChat(person.id);
    }
  };

  // Filter users based on search query
  const filteredUsers = followingUsers.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {followingUsers.length > 0 || chats.filter(chat => chat.type === 'private').length > 0 ? (
        <div className="space-y-4">
          {/* Display actual user chats (private) */}
          {chats.filter(chat => chat.type === 'private').length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-white mb-3">Your Private Chats</h4>
              {chats.filter(chat => chat.type === 'private').map(chat => {
                const participant = chat.participants.find(p => p.id !== user.id);
                if (!participant) return null;

                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className="w-full p-4 text-left hover:bg-gray-800/50 transition-all duration-200 flex items-center space-x-4 rounded-xl border border-gray-700 mb-2"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-sm overflow-hidden">
                      {participant.profilePicture ? (
                        <img
                          src={participant.profilePicture}
                          alt={participant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{participant.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {chat.messages && chat.messages.length > 0
                          ? chat.messages[chat.messages.length - 1].content
                          : 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <h4 className="font-semibold text-white mb-3 mt-8">People you follow or who follow you:</h4>
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((person) => (
                <button
                  key={person.id}
                  onClick={() => handleUserClick(person)}
                  className="w-full p-4 text-left hover:bg-gray-800/50 transition-all duration-200 flex items-center space-x-4 rounded-xl border border-gray-700"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-sm overflow-hidden">
                    {person.profilePicture ? (
                      <img
                        src={person.profilePicture}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{person.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{person.email}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
             <p className="text-gray-500 text-sm">No users found matching your search.</p>
          )}

        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No conversations or users yet</h3>
          <p className="text-gray-400 mb-6">Start chatting by finding study partners or joining communities.</p>
        </div>
      )}
    </div>
  );
};


// Helper component for the "Communities" tab content
interface CommunitiesTabProps {
  communities: Community[];
  onCommunityClick: (community: Community) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
const CommunitiesTab: React.FC<CommunitiesTabProps> = ({ communities, onCommunityClick, searchQuery, onSearchChange }) => {
  // Filter communities based on search query
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {filteredCommunities.length > 0 ? (
        <div className="space-y-4">
          {filteredCommunities.map((community) => (
            <button
              key={community.id}
              onClick={() => onCommunityClick(community)}
              className="w-full p-4 text-left hover:bg-gray-800/50 transition-all duration-200 flex items-center space-x-4 rounded-xl border border-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{community.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{community.memberCount} members</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No communities found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or join communities to start group discussions</p>
        </div>
      )}
    </div>
  );
};


// Main ChatInterface Component
export default function ChatInterface({
  user,
  chats,
  notes,
  flipCardSets,
  communities,
  onSendMessage,
  onCreateChat
}: {
  user: UserType;
  chats: Chat[];
  notes: Note[];
  flipCardSets: FlipCardSet[];
  communities: Community[];
  onSendMessage: (chatId: string, content: string, attachedResource?: any) => void;
  onCreateChat: (userId: string) => void;
}) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'people' | 'communities'>('people');
  const [peopleSearchQuery, setPeopleSearchQuery] = useState('');
  const [communitiesSearchQuery, setCommunitiesSearchQuery] = useState('');

  // Sample following users for people tab (followers and following)
  const followingUsers: UserType[] = [
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 156,
      following: 89,
      profileVisibility: 'public',
      joinDate: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      followers: 203,
      following: 145,
      profileVisibility: 'public',
      joinDate: '2024-01-05T00:00:00Z'
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma@example.com',
      profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: 89,
      following: 67,
      profileVisibility: 'public',
      joinDate: '2024-01-15T00:00:00Z'
    }
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages whenever messages or selectedChat changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat, chats]);

  const currentChat = chats.find(chat => chat.id === selectedChat);
  const otherParticipant = currentChat?.participants.find(p => p.id !== user.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageContent.trim() && (selectedChat || selectedCommunity)) {
      if (selectedChat) {
        onSendMessage(selectedChat, messageContent.trim());
      } else if (selectedCommunity) {
        // Handle community message sending
        console.log('Sending message to community:', selectedCommunity.id, messageContent.trim());
        // In a real app, this would send a message to the community
      }
      setMessageContent('');
    }
  };

  const handleAttachResource = (resource: Note | FlipCardSet, type: 'note' | 'flipcard') => {
    if (selectedChat) {
      onSendMessage(selectedChat, `Shared ${type}: ${resource.title}`, {
        id: resource.id,
        title: resource.title,
        type
      });
      setShowResourceModal(false);
    } else if (selectedCommunity) {
      // Handle community resource sharing
      console.log('Sharing resource to community:', selectedCommunity.id, resource);
      setShowResourceModal(false);
    }
  };

  const handleCommunityClick = (community: Community) => {
    setSelectedCommunity(community);
    setSelectedChat(null);
  };

  // When selecting a user from PeopleTab directly
  const handleSelectChatFromList = (chatId: string) => {
    setSelectedChat(chatId);
    setSelectedCommunity(null);
  };

  // Community Chat View
  if (selectedCommunity) {
    return (
      <div className="min-h-screen bg-gray-950 relative flex flex-col">
        <AnimatedBackground />

        <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col relative z-10 w-full rounded-2xl shadow-xl border border-gray-700 overflow-hidden my-4">
          {/* Community Chat Header */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center space-x-4 rounded-t-2xl shadow-sm">
            <button
              onClick={() => setSelectedCommunity(null)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-sm">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{selectedCommunity.name}</h3>
                <p className="text-sm text-green-400">{selectedCommunity.memberCount} members</p>
              </div>
            </div>
          </div>

          {/* Community Messages Area */}
          <div className="flex-1 bg-gray-950/80 backdrop-blur-sm p-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {/* Sample community messages */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-800/80 backdrop-blur-sm text-gray-100 shadow-sm border border-gray-700">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-blue-400">Sarah Johnson</span>
                  </div>
                  <p className="text-sm">Hey everyone! I just uploaded some calculus notes. Check them out!</p>
                  <p className="text-xs mt-2 text-gray-400">2:30 PM</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-800/80 backdrop-blur-sm text-gray-100 shadow-sm border border-gray-700">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-purple-400">Mike Chen</span>
                  </div>
                  <p className="text-sm">Thanks Sarah! Those will be really helpful for the upcoming exam.</p>
                  <p className="text-xs mt-2 text-gray-400">2:32 PM</p>
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Community Message Input */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 p-4 rounded-b-2xl shadow-sm">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
              <button
                type="button"
                onClick={() => setShowResourceModal(true)}
                className="p-3 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 flex-shrink-0"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder={`Message ${selectedCommunity.name}...`}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-white placeholder-gray-400"
                  rows={1}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!messageContent.trim()}
                className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Resource Sharing Modal */}
          {showResourceModal && (
            <ResourceModal
              notes={notes}
              flipCardSets={flipCardSets}
              onAttach={handleAttachResource}
              onClose={() => setShowResourceModal(false)}
            />
          )}
        </div>
      </div>
    );
  }

  if (selectedChat) {
    if (!currentChat) {
      return (
        <div className="min-h-screen bg-gray-950 relative flex items-center justify-center">
          <AnimatedBackground />
          <div className="p-8 text-center text-white relative z-10">
            <MessageCircle className="w-20 h-20 mx-auto mb-4 text-blue-400 animate-pulse" />
            <h2 className="text-xl font-semibold">Loading chat...</h2>
            <p className="text-gray-400">Please wait while we fetch the conversation.</p>
            <button
              onClick={() => setSelectedChat(null)}
              className="mt-6 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go back to chats
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-950 relative flex flex-col">
        <AnimatedBackground />

        <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col relative z-10 w-full rounded-2xl shadow-xl border border-gray-700 overflow-hidden my-4">
          <ChatHeader
            otherParticipant={otherParticipant}
            onBack={() => setSelectedChat(null)}
          />

          {/* Messages Area */}
          <div className="flex-1 bg-gray-950/80 backdrop-blur-sm p-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {currentChat.messages && currentChat.messages.length > 0 ? (
                currentChat.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={message.senderId === user.id}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ScrollText className="w-16 h-16 mx-auto mb-4" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 p-4 rounded-b-2xl shadow-sm">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
              <button
                type="button"
                onClick={() => setShowResourceModal(true)}
                className="p-3 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 flex-shrink-0"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-white placeholder-gray-400"
                  rows={1}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!messageContent.trim()}
                className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Resource Sharing Modal */}
          {showResourceModal && (
            <ResourceModal
              notes={notes}
              flipCardSets={flipCardSets}
              onAttach={handleAttachResource}
              onClose={() => setShowResourceModal(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // Main Chat List View (when no chat is selected)
  return (
    <div className="min-h-screen bg-gray-950 relative flex flex-col">
      <AnimatedBackground />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full">
        <ChatListHeader />

        {/* Tabs */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('people')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'people'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              People
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'communities'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Communities
            </button>
          </div>

          <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
            {activeTab === 'people' ? (
              <PeopleTab
                followingUsers={followingUsers}
                onCreateChat={onCreateChat}
                onSelectChat={handleSelectChatFromList}
                chats={chats}
                user={user}
                searchQuery={peopleSearchQuery}
                onSearchChange={setPeopleSearchQuery}
              />
            ) : (
              <CommunitiesTab
                communities={communities}
                onCommunityClick={handleCommunityClick}
                searchQuery={communitiesSearchQuery}
                onSearchChange={setCommunitiesSearchQuery}
              />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a202c;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4a5568;
          border-radius: 10px;
          border: 2px solid #1a202c;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6366f1;
        }
      `}</style>
    </div>
  );
}