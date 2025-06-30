import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, GraduationCap, Users, Loader2 } from 'lucide-react';
import AuthForm from './components/Auth/AuthForm';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import BottomNav from './components/Navigation/BottomNav';
import Dashboard from './components/Dashboard/Dashboard';
import NotesManager from './components/Notes/NotesManager';
import FlipCardsManager from './components/FlipCards/FlipCardsManager';
import Profile from './components/Profile/Profile';
import ChatInterface from './components/Chat/ChatInterface';
import Explore from './components/Explore/Explore';
import Communities from './components/Communities/Communities';
import StudySessions from './components/StudySessions/StudySessions';
import Infovids from './components/Infovids/Infovids';
import Store from './components/Store/Store';
import MyStore from './components/MyStore/MyStore';
import PublicNotes from './components/PublicContent/PublicNotes';
import PublicFlipCards from './components/PublicContent/PublicFlipCards';
import PublicCommunities from './components/PublicContent/PublicCommunities';
import PublicStudySessions from './components/PublicContent/PublicStudySessions';
import PublicInfovids from './components/PublicContent/PublicInfovids';
import PaymentInterface from './components/Payment/PaymentInterface';
import HomePage from './components/Home/HomePage';
import { supabase } from './lib/supabase';
import type { User, Note, FlipCardSet, Post, RecentActivity, Community, VideoReel, Course, Purchase, Chat, ChatMessage, StudySession } from './types';

function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [previousView, setPreviousView] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewHistory, setViewHistory] = useState<string[]>(['home']);

  // Sample data for demonstration
  const [notes, setNotes] = useState<Note[]>([]);
  const [flipCardSets, setFlipCardSets] = useState<FlipCardSet[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [infovids, setInfovids] = useState<VideoReel[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setIsLoggedIn(true);
        fetchUserData(data.session.user.id);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsLoggedIn(true);
          fetchUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }
      
      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          profilePicture: data.profile_picture,
          bio: data.bio,
          education: data.education,
          location: data.location,
          followers: data.followers || 0,
          following: data.following || 0,
          profileVisibility: data.profile_visibility || 'public',
          joinDate: data.join_date || data.created_at
        });
        
        // After getting user data, fetch other related data
        fetchUserContent(userId);
      } else {
        // User profile doesn't exist in the database yet
        console.log('User profile not found in database');
        // You might want to create a default user profile here or handle this case appropriately
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserContent = async (userId: string) => {
    // This would fetch notes, flip cards, etc. from Supabase
    // For now, we'll use sample data
    
    // Sample notes
    setNotes([
      {
        id: '1',
        title: 'Advanced Calculus Concepts',
        summary: 'Comprehensive guide to derivatives, integrals, and their applications.',
        content: 'Detailed notes on calculus concepts including limits, derivatives, and integrals...',
        tags: ['calculus', 'mathematics', 'derivatives'],
        uploadDate: '2024-01-15T10:00:00Z',
        fileType: 'pdf',
        userId: '1',
        userName: 'You',
        isPublic: true,
        saves: 234,
        posterUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '2',
        title: 'Quantum Physics Fundamentals',
        summary: 'Introduction to quantum mechanics and wave-particle duality.',
        content: 'Notes covering the basics of quantum physics...',
        tags: ['physics', 'quantum', 'mechanics'],
        uploadDate: '2024-01-14T15:30:00Z',
        fileType: 'pdf',
        userId: '1',
        userName: 'You',
        isPublic: false,
        saves: 0,
        posterUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ]);
    
    // Sample flip card sets
    setFlipCardSets([
      {
        id: '1',
        title: 'Calculus Quick Review',
        cards: [
          { id: '1', question: 'What is a derivative?', answer: 'Rate of change of a function' },
          { id: '2', question: 'What is an integral?', answer: 'Area under a curve' },
          { id: '3', question: 'Chain rule formula', answer: 'd/dx[f(g(x))] = f\'(g(x)) × g\'(x)' }
        ],
        createdDate: '2024-01-16T09:00:00Z',
        userId: '1',
        userName: 'You',
        isPublic: true,
        saves: 156,
        posterUrl: 'https://images.pexels.com/photos/5926392/pexels-photo-5926392.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['calculus', 'mathematics', 'derivatives']
      }
    ]);
    
    // Sample activities
    setRecentActivities([
      {
        id: '1',
        type: 'note_upload',
        title: 'Uploaded New Note',
        description: 'Advanced Calculus Concepts',
        timestamp: '2024-01-15T10:00:00Z',
        relatedId: '1'
      },
      {
        id: '2',
        type: 'flipcard_create',
        title: 'Created Flip Card Set',
        description: 'Calculus Quick Review',
        timestamp: '2024-01-16T09:00:00Z',
        relatedId: '1'
      }
    ]);
    
    // Sample communities
    setCommunities([
      {
        id: '1',
        name: 'Mathematics Study Group',
        description: 'A community for math enthusiasts to share resources and discuss concepts.',
        posterUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400',
        creatorId: '1',
        memberCount: 156,
        isPrivate: false,
        tags: ['mathematics', 'calculus', 'algebra'],
        createdDate: '2024-01-01T00:00:00Z',
        isMember: true
      }
    ]);
    
    // Sample chats
    setChats([
      {
        id: '1',
        participants: [
          {
            id: '1',
            name: user?.name || 'You',
            email: user?.email || 'you@example.com',
            followers: 0,
            following: 0,
            profileVisibility: 'public',
            joinDate: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
            followers: 156,
            following: 89,
            profileVisibility: 'public',
            joinDate: '2024-01-10T00:00:00Z'
          }
        ],
        lastActivity: '2024-01-20T14:30:00Z',
        type: 'private',
        messages: [
          {
            id: '1',
            senderId: '2',
            senderName: 'Sarah Johnson',
            content: 'Hi there! I saw your calculus notes. They were really helpful!',
            timestamp: '2024-01-20T14:25:00Z'
          },
          {
            id: '2',
            senderId: '1',
            senderName: user?.name || 'You',
            content: 'Thanks! I\'m glad they were useful. Let me know if you have any questions!',
            timestamp: '2024-01-20T14:30:00Z'
          }
        ]
      }
    ]);
  };

  const handleAuth = async (userData: { name: string; email: string }) => {
    setUser({
      id: '1',
      name: userData.name,
      email: userData.email,
      followers: 0,
      following: 0,
      profileVisibility: 'public',
      joinDate: new Date().toISOString()
    });
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    
    // Add welcome notification
    addNotification({
      type: 'success',
      title: 'Welcome!',
      message: `Welcome to StudyMates, ${userData.name}!`
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('home');
    setViewHistory(['home']);
  };

  const handleNavigate = (view: string) => {
    setPreviousView(currentView);
    setCurrentView(view);
    
    // Update view history for back navigation
    setViewHistory(prev => [...prev, view]);
  };

  const handleNavigateBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];
      setCurrentView(previousView);
      setViewHistory(newHistory);
    }
  };

  const addNotification = (notification: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string; }) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleAddNote = (note: Omit<Note, 'id'>) => {
    const newNote = {
      ...note,
      id: Date.now().toString()
    };
    setNotes(prev => [newNote, ...prev]);
    
    // Add activity
    const newActivity = {
      id: Date.now().toString(),
      type: 'note_upload',
      title: 'Uploaded New Note',
      description: note.title,
      timestamp: new Date().toISOString(),
      relatedId: newNote.id
    };
    setRecentActivities(prev => [newActivity, ...prev]);
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Note Uploaded',
      message: `Your note "${note.title}" has been uploaded successfully!`
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Note Deleted',
      message: 'Your note has been deleted successfully.'
    });
  };

  const handleCreateFlipCardSet = (set: Omit<FlipCardSet, 'id'>) => {
    const newSet = {
      ...set,
      id: Date.now().toString()
    };
    setFlipCardSets(prev => [newSet, ...prev]);
    
    // Add activity
    const newActivity = {
      id: Date.now().toString(),
      type: 'flipcard_create',
      title: 'Created Flip Card Set',
      description: set.title,
      timestamp: new Date().toISOString(),
      relatedId: newSet.id
    };
    setRecentActivities(prev => [newActivity, ...prev]);
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Flip Card Set Created',
      message: `Your flip card set "${set.title}" has been created successfully!`
    });
  };

  const handleDeleteFlipCardSet = (id: string) => {
    setFlipCardSets(prev => prev.filter(set => set.id !== id));
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Flip Card Set Deleted',
      message: 'Your flip card set has been deleted successfully.'
    });
  };

  const handleDeleteActivity = (id: string) => {
    setRecentActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const handleDeleteAllActivities = () => {
    setRecentActivities([]);
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Activities Cleared',
      message: 'All activities have been cleared successfully.'
    });
  };

  const handleCreatePost = (content: string) => {
    const newPost = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      userName: user?.name || 'You',
      userProfilePicture: user?.profilePicture,
      content,
      timestamp: new Date().toISOString()
    };
    setPosts(prev => [newPost, ...prev]);
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Post Created',
      message: 'Your post has been created successfully.'
    });
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...updates
      });
      
      // Add notification
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.'
      });
    }
  };

  const handleFollowUser = (userToFollow: User) => {
    // Add to following list
    setFollowing(prev => [...prev, userToFollow]);
    
    // Update user stats
    if (user) {
      setUser({
        ...user,
        following: user.following + 1
      });
    }
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'User Followed',
      message: `You are now following ${userToFollow.name}.`
    });
  };

  const handleUnfollowUser = (userToUnfollow: User) => {
    // Remove from following list
    setFollowing(prev => prev.filter(u => u.id !== userToUnfollow.id));
    
    // Update user stats
    if (user) {
      setUser({
        ...user,
        following: Math.max(0, user.following - 1)
      });
    }
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'User Unfollowed',
      message: `You have unfollowed ${userToUnfollow.name}.`
    });
  };

  const handleFollowBack = (userToFollow: User) => {
    // Same as follow user
    handleFollowUser(userToFollow);
  };

  const handleSaveNote = (noteId: string) => {
    // In a real app, this would save the note to the user's saved notes
    // For now, just show a notification
    addNotification({
      type: 'success',
      title: 'Note Saved',
      message: 'The note has been saved to your collection.'
    });
  };

  const handleSaveFlipCard = (setId: string) => {
    // In a real app, this would save the flip card set to the user's saved sets
    // For now, just show a notification
    addNotification({
      type: 'success',
      title: 'Flip Card Set Saved',
      message: 'The flip card set has been saved to your collection.'
    });
  };

  const handleJoinCommunity = (communityId: string) => {
    // Update the community to mark the user as a member
    setCommunities(prev => 
      prev.map(community => 
        community.id === communityId 
          ? { ...community, isMember: true } 
          : community
      )
    );
    
    // Add activity
    const community = communities.find(c => c.id === communityId);
    if (community) {
      const newActivity = {
        id: Date.now().toString(),
        type: 'community_join',
        title: 'Joined Community',
        description: community.name,
        timestamp: new Date().toISOString(),
        relatedId: communityId
      };
      setRecentActivities(prev => [newActivity, ...prev]);
      
      // Add notification
      addNotification({
        type: 'success',
        title: 'Community Joined',
        message: `You have joined the "${community.name}" community.`
      });
    }
  };

  const handleCreateCommunity = (community: Omit<Community, 'id' | 'creatorId' | 'memberCount' | 'createdDate'>) => {
    const newCommunity = {
      ...community,
      id: Date.now().toString(),
      creatorId: user?.id || '1',
      memberCount: 1, // Just the creator
      createdDate: new Date().toISOString(),
      isMember: true // Creator is automatically a member
    };
    setCommunities(prev => [newCommunity, ...prev]);
    
    // Add activity
    const newActivity = {
      id: Date.now().toString(),
      type: 'community_join',
      title: 'Created Community',
      description: community.name,
      timestamp: new Date().toISOString(),
      relatedId: newCommunity.id
    };
    setRecentActivities(prev => [newActivity, ...prev]);
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Community Created',
      message: `Your community "${community.name}" has been created successfully!`
    });
  };

  const handleDeleteCommunity = (communityId: string) => {
    setCommunities(prev => prev.filter(community => community.id !== communityId));
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Community Deleted',
      message: 'The community has been deleted successfully.'
    });
  };

  const handleCreateInfovid = (infovid: Omit<VideoReel, 'id' | 'creatorId' | 'views' | 'likes' | 'createdDate'>) => {
    const newInfovid = {
      ...infovid,
      id: Date.now().toString(),
      creatorId: user?.id || '1',
      views: 0,
      likes: 0,
      createdDate: new Date().toISOString(),
      isLiked: false
    };
    setInfovids(prev => [newInfovid, ...prev]);
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Infovid Created',
      message: `Your infovid "${infovid.title}" has been created successfully!`
    });
  };

  const handleDeleteInfovid = (infovidId: string) => {
    setInfovids(prev => prev.filter(infovid => infovid.id !== infovidId));
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Infovid Deleted',
      message: 'The infovid has been deleted successfully.'
    });
  };

  const handleSaveInfovid = (infovidId: string) => {
    // In a real app, this would save the infovid to the user's saved infovids
    // For now, just show a notification
    addNotification({
      type: 'success',
      title: 'Infovid Saved',
      message: 'The infovid has been saved to your collection.'
    });
  };

  const handleCreateResource = (resource: Omit<Course, 'id' | 'instructorId' | 'enrollments' | 'rating' | 'reviews' | 'createdDate' | 'isPublished'>) => {
    const newResource = {
      ...resource,
      id: Date.now().toString(),
      instructorId: user?.id || '1',
      enrollments: 0,
      rating: 0,
      reviews: 0,
      createdDate: new Date().toISOString(),
      isPublished: true
    };
    setCourses(prev => [newResource, ...prev]);
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Resource Created',
      message: `Your resource "${resource.title}" has been created successfully!`
    });
  };

  const handleDeleteResource = (resourceId: string) => {
    setCourses(prev => prev.filter(course => course.id !== resourceId));
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Resource Deleted',
      message: 'The resource has been deleted successfully.'
    });
  };

  const handlePurchaseCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      handleNavigate('payment');
    }
  };

  const handlePaymentComplete = (purchase: Purchase) => {
    setPurchases(prev => [purchase, ...prev]);
    
    // Add activity
    const newActivity = {
      id: Date.now().toString(),
      type: 'course_purchase',
      title: 'Purchased Course',
      description: purchase.courseName,
      timestamp: new Date().toISOString(),
      relatedId: purchase.courseId
    };
    setRecentActivities(prev => [newActivity, ...prev]);
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Purchase Complete',
      message: `You have successfully purchased "${purchase.courseName}"!`
    });
    
    // Navigate back to store
    handleNavigate('store');
  };

  const handleCreateSession = (session: Omit<StudySession, 'id' | 'hostId' | 'participants' | 'isActive'>) => {
    const newSession = {
      ...session,
      id: Date.now().toString(),
      hostId: user?.id || '1',
      hostName: user?.name || 'You',
      hostProfilePicture: user?.profilePicture,
      participants: [
        {
          id: user?.id || '1',
          name: user?.name || 'You',
          email: user?.email || 'you@example.com',
          followers: user?.followers || 0,
          following: user?.following || 0,
          profileVisibility: user?.profileVisibility || 'public',
          joinDate: user?.joinDate || new Date().toISOString()
        }
      ],
      isActive: false
    };
    setStudySessions(prev => [newSession, ...prev]);
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Study Session Created',
      message: `Your study session "${session.title}" has been created successfully!`
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    setStudySessions(prev => prev.filter(session => session.id !== sessionId));
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Study Session Deleted',
      message: 'The study session has been deleted successfully.'
    });
  };

  const handleSendMessage = (chatId: string, content: string, attachedResource?: any) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || '1',
      senderName: user?.name || 'You',
      content,
      timestamp: new Date().toISOString(),
      attachedResource
    };
    
    setChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              messages: [...(chat.messages || []), newMessage],
              lastActivity: new Date().toISOString(),
              lastMessage: newMessage
            } 
          : chat
      )
    );
  };

  const handleCreateChat = (userId: string) => {
    // Find the user to chat with
    const targetUser = [...followers, ...following].find(u => u.id === userId);
    if (!targetUser) return;
    
    // Check if chat already exists
    const existingChat = chats.find(chat => 
      chat.type === 'private' && 
      chat.participants.length === 2 && 
      chat.participants.some(p => p.id === userId) && 
      chat.participants.some(p => p.id === user?.id)
    );
    
    if (existingChat) {
      handleNavigate('chat');
      return;
    }
    
    // Create new chat
    const newChat: Chat = {
      id: Date.now().toString(),
      participants: [
        {
          id: user?.id || '1',
          name: user?.name || 'You',
          email: user?.email || 'you@example.com',
          followers: user?.followers || 0,
          following: user?.following || 0,
          profileVisibility: user?.profileVisibility || 'public',
          joinDate: user?.joinDate || new Date().toISOString()
        },
        targetUser
      ],
      lastActivity: new Date().toISOString(),
      type: 'private',
      messages: []
    };
    
    setChats(prev => [newChat, ...prev]);
    handleNavigate('chat');
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Chat Created',
      message: `You can now chat with ${targetUser.name}.`
    });
  };

  const handleSkipSignIn = () => {
    setCurrentView('home');
  };

  // Animated background for the auth page
  const AnimatedBackground = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
          {i % 4 === 0 ? <BookOpen /> : 
           i % 4 === 1 ? <Brain /> : 
           i % 4 === 2 ? <GraduationCap /> : <Users />}
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

  // Render the appropriate view
  const renderView = () => {
    if (currentView === 'login' || (!isLoggedIn && currentView !== 'home')) {
      return <AuthForm onAuth={handleAuth} onSkipSignIn={handleSkipSignIn} />;
    }

    // Show loading state if logged in but user data not yet loaded
    if (isLoggedIn && !user && currentView !== 'home') {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading your profile...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'dashboard':
        return (
          <Dashboard 
            user={user!} 
            notes={notes} 
            flipCardSets={flipCardSets} 
            posts={posts} 
            recentActivities={recentActivities}
            onNavigate={handleNavigate}
            onCreatePost={handleCreatePost}
            onDeleteActivity={handleDeleteActivity}
            onDeleteAllActivities={handleDeleteAllActivities}
          />
        );
      case 'notes':
        return (
          <NotesManager 
            notes={notes} 
            onAddNote={handleAddNote} 
            onDeleteNote={handleDeleteNote} 
          />
        );
      case 'flipcards':
        return (
          <FlipCardsManager 
            flipCardSets={flipCardSets} 
            notes={notes}
            onCreateSet={handleCreateFlipCardSet} 
            onDeleteSet={handleDeleteFlipCardSet} 
          />
        );
      case 'profile':
        return (
          <Profile 
            user={user!} 
            notes={notes} 
            flipCardSets={flipCardSets} 
            purchases={purchases} 
            recentActivities={recentActivities}
            savedCommunities={communities.filter(c => c.isMember)}
            savedSessions={studySessions}
            savedInfovids={infovids}
            savedCourses={courses}
            followers={followers}
            following={following}
            onUpdateProfile={handleUpdateProfile}
            onDeleteActivity={handleDeleteActivity}
            onDeleteAllActivities={handleDeleteAllActivities}
            onNavigate={handleNavigate}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
            onFollowBack={handleFollowBack}
          />
        );
      case 'chat':
        return (
          <ChatInterface 
            user={user!} 
            chats={chats} 
            notes={notes}
            flipCardSets={flipCardSets}
            communities={communities}
            onSendMessage={handleSendMessage}
            onCreateChat={handleCreateChat}
          />
        );
      case 'explore':
        return (
          <Explore 
            currentUser={user!} 
            isLoggedIn={isLoggedIn}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
            onSaveNote={handleSaveNote}
            onSaveFlipCard={handleSaveFlipCard}
            onJoinCommunity={handleJoinCommunity}
            onPurchaseCourse={handlePurchaseCourse}
            onAddNotification={addNotification}
          />
        );
      case 'communities':
        return (
          <Communities 
            user={user!} 
            communities={communities}
            posts={posts}
            onCreateCommunity={handleCreateCommunity}
            onJoinCommunity={handleJoinCommunity}
            onDeleteCommunity={handleDeleteCommunity}
          />
        );
      case 'study-sessions':
        return (
          <StudySessions 
            user={user!} 
            sessions={studySessions}
            onCreateSession={handleCreateSession}
            onDeleteSession={handleDeleteSession}
          />
        );
      case 'infovids':
        return (
          <Infovids 
            user={user!} 
            infovids={infovids}
            onCreateInfovid={handleCreateInfovid}
            onDeleteInfovid={handleDeleteInfovid}
          />
        );
      case 'store':
        return (
          <Store 
            user={user!} 
            isLoggedIn={isLoggedIn}
            onPurchaseCourse={handlePurchaseCourse}
            onAddNotification={addNotification}
          />
        );
      case 'my-store':
        return (
          <MyStore 
            user={user!} 
            purchases={purchases}
            savedCourses={courses}
            onNavigate={handleNavigate}
            onCreateResource={handleCreateResource}
            onDeleteResource={handleDeleteResource}
          />
        );
      case 'payment':
        return selectedCourse ? (
          <PaymentInterface 
            course={selectedCourse} 
            onPaymentComplete={handlePaymentComplete} 
            onCancel={() => handleNavigate('store')} 
          />
        ) : (
          <div>No course selected for payment.</div>
        );
      case 'public-notes':
        return (
          <PublicNotes 
            onNavigate={handleNavigate} 
            onSaveNote={handleSaveNote}
            isLoggedIn={isLoggedIn}
          />
        );
      case 'public-flipcards':
        return (
          <PublicFlipCards 
            onNavigate={handleNavigate} 
            onSaveFlipCard={handleSaveFlipCard}
            isLoggedIn={isLoggedIn}
          />
        );
      case 'public-communities':
        return (
          <PublicCommunities 
            onNavigate={handleNavigate} 
            user={user}
            onJoinCommunity={handleJoinCommunity}
            isLoggedIn={isLoggedIn}
          />
        );
      case 'public-sessions':
        return (
          <PublicStudySessions 
            onNavigate={handleNavigate} 
            user={user}
            onAddNotification={addNotification}
            isLoggedIn={isLoggedIn}
          />
        );
      case 'public-infovids':
        return (
          <PublicInfovids 
            onNavigate={handleNavigate} 
            onSaveInfovid={handleSaveInfovid}
            isLoggedIn={isLoggedIn}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {currentView !== 'login' && (
        <Header 
          user={user} 
          onLogout={handleLogout} 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          onNavigateBack={handleNavigateBack}
          showBackButton={viewHistory.length > 1}
          notifications={notifications}
          onDismissNotification={dismissNotification}
          onClearAllNotifications={clearAllNotifications}
          isLoggedIn={isLoggedIn}
        />
      )}
      
      <main className="flex-1">
        {renderView()}
      </main>
      
      {currentView !== 'login' && (
        <>
          <Footer />
          <BottomNav currentView={currentView} onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
}

export default App;