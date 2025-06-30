export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  education?: string;
  location?: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
  profileVisibility: 'public' | 'private';
  joinDate: string;
  purchasedCourses?: string[];
  createdCourses?: string[];
  savedNotes?: string[];
  savedFlipCards?: string[];
  savedInfovids?: string[];
}

export interface Note {
  id: string;
  title: string;
  summary: string;
  content?: string;
  tags: string[];
  uploadDate: string;
  fileType: 'pdf' | 'text' | 'image';
  fileUrl?: string;
  posterUrl?: string;
  thumbnailUrl?: string; // Added thumbnail support
  userId: string;
  userName: string;
  userProfilePicture?: string;
  isPublic: boolean;
  saves?: number;
}

export interface FlipCard {
  id: string;
  question: string;
  answer: string;
}

export interface FlipCardSet {
  id: string;
  title: string;
  cards: FlipCard[];
  noteId?: string;
  posterUrl?: string;
  thumbnailUrl?: string; // Added thumbnail support
  createdDate: string;
  userId: string;
  userName: string;
  userProfilePicture?: string;
  isPublic: boolean;
  saves?: number;
  tags?: string[]; // Added tags support
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  price: number; // 0 for free courses
  currency: string;
  instructorId: string;
  instructorName: string;
  instructorProfilePicture?: string;
  videos: CourseVideo[];
  tags: string[];
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // total duration in minutes
  enrollments: number;
  rating: number;
  reviews: number;
  createdDate: string;
  isPublished: boolean;
  type?: 'course' | 'ebook' | 'book'; // Added for EduStore
}

export interface CourseVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  order: number;
  isPreview: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  purchaseDate: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userProfilePicture?: string;
  content: string;
  timestamp: string;
  communityId?: string;
  attachments?: {
    type: 'note' | 'flipcard' | 'video';
    id: string;
    title: string;
    url?: string;
  }[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  posterUrl?: string;
  thumbnailUrl?: string; // Added thumbnail support
  creatorId: string;
  memberCount: number;
  isPrivate: boolean;
  tags: string[];
  createdDate: string;
  isMember?: boolean;
}

export interface StudySession {
  id: string;
  title: string;
  description: string;
  posterUrl?: string;
  thumbnailUrl?: string; // Added thumbnail support
  hostId: string;
  hostName: string;
  hostProfilePicture?: string;
  participants: User[];
  scheduledTime: string;
  duration: number; // in minutes
  isActive: boolean;
  maxParticipants: number;
  subject: string;
  meetingUrl?: string;
  isPublic: boolean;
  tags: string[];
}

export interface VideoReel {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  creatorId: string;
  creatorName: string;
  creatorProfilePicture?: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  saves?: number;
  tags: string[];
  subject: string;
  createdDate: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  attachedResource?: {
    id: string;
    title: string;
    type: 'note' | 'flipcard';
  };
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  lastActivity: string;
  isStudySession?: boolean;
  studySessionId?: string;
  type?: 'private' | 'group'; // Added chat type
  messages?: ChatMessage[]; // Added messages array
}

export interface RecentActivity {
  id: string;
  type: 'note_upload' | 'flipcard_create' | 'community_join' | 'session_join' | 'course_purchase' | 'note_save' | 'flipcard_save' | 'infovid_save';
  title: string;
  description: string;
  timestamp: string;
  relatedId: string;
}