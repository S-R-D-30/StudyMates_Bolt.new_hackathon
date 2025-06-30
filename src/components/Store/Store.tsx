import React, { useState } from 'react';
import { Play, Star, Clock, Users, DollarSign, Plus, Search, Filter, BookOpen, ShoppingCart, Eye, Heart, Book, FileText, X, User } from 'lucide-react';
import type { Course, User as UserType } from '../../types';

interface StoreProps {
  user: UserType;
  isLoggedIn: boolean;
  onPurchaseCourse: (courseId: string) => void;
  onAddNotification?: (notification: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string; }) => void;
}

/**
 * Course/Resource Preview Modal - Same design as other preview modals
 */
const CoursePreviewModal = ({ course, onClose, onPurchaseCourse, isLoggedIn, onAddNotification }) => {
  if (!course) return null;

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'course': return 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
      case 'ebook': return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
      case 'book': return 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <Play className="w-8 h-8 text-green-400" />;
      case 'ebook': return <FileText className="w-8 h-8 text-blue-400" />;
      case 'book': return <Book className="w-8 h-8 text-purple-400" />;
      default: return <BookOpen className="w-8 h-8 text-gray-400" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handlePurchase = () => {
    if (!isLoggedIn) {
      if (onAddNotification) {
        onAddNotification({
          type: 'warning',
          title: 'Login Required',
          message: 'Login to Purchase courses and resources'
        });
      }
      return;
    }
    
    onPurchaseCourse(course.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-gray-700 relative m-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0 mt-1">
            {getTypeIcon(course.type)}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">{course.title}</h3>
            <span className="text-green-400 font-medium">{course.type === 'course' ? 'Course' : course.type === 'ebook' ? 'eBook' : 'Book'} Preview</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Course thumbnail */}
          <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden">
            <img src={course.thumbnailUrl || getDefaultThumbnail(course.type)} alt={course.title} className="w-full h-full object-cover" />
          </div>

          {/* Instructor and course info */}
          <div className="flex items-start space-x-3 text-gray-400">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              {course.instructorProfilePicture ? (
                <img src={course.instructorProfilePicture} alt={course.instructorName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-500 m-2" />
              )}
            </div>
            <div>
              <p className="text-base font-medium text-gray-300">Created by {course.instructorName}</p>
              <p className="text-xs text-gray-500">
                {course.category} • {course.level} • {course.enrollments} {course.type === 'course' ? 'students' : 'purchases'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
            <p className="text-gray-300 leading-relaxed">{course.description}</p>
          </div>

          {/* Course details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{course.rating} ({course.reviews} reviews)</span>
              </div>
              {course.type === 'course' && course.duration > 0 && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{course.enrollments} {course.type === 'course' ? 'students' : 'purchases'}</span>
              </div>
            </div>
            <div className="space-y-2">
              {course.type === 'course' && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <Play className="w-4 h-4" />
                  <span>{course.videos.length} lessons</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span>{course.level} level</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {course.price === 0 ? (
                  <span className="text-blue-400">Free</span>
                ) : (
                  <span>${course.price}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handlePurchase}
              className={`flex-1 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 ${
                course.price === 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{course.price === 0 ? 'Get Free' : 'Buy Now'}</span>
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Add to Wishlist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Store({ user, isLoggedIn, onPurchaseCourse, onAddNotification }: StoreProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPrice, setFilterPrice] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Sample courses and educational resources data from all users
  const allUserResources: Course[] = [
    {
      id: '1',
      title: 'Complete Calculus Mastery',
      description: 'Master calculus from basics to advanced topics with step-by-step explanations and practice problems.',
      thumbnailUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 49.99,
      currency: 'USD',
      instructorId: '2',
      instructorName: 'Sarah Johnson',
      instructorProfilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      videos: [
        { id: '1', title: 'Introduction to Limits', description: 'Understanding the concept of limits', videoUrl: '', duration: 1200, order: 1, isPreview: true },
        { id: '2', title: 'Derivative Fundamentals', description: 'Basic derivative rules and applications', videoUrl: '', duration: 1800, order: 2, isPreview: false }
      ],
      tags: ['calculus', 'mathematics', 'derivatives', 'integrals'],
      category: 'Mathematics',
      level: 'Intermediate',
      duration: 480,
      enrollments: 1247,
      rating: 4.8,
      reviews: 156,
      createdDate: '2024-01-10T00:00:00Z',
      isPublished: true,
      type: 'course'
    },
    {
      id: '2',
      title: 'Advanced Physics eBook',
      description: 'Comprehensive digital textbook covering quantum mechanics and relativity.',
      thumbnailUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 29.99,
      currency: 'USD',
      instructorId: '4',
      instructorName: 'Emma Davis',
      videos: [],
      tags: ['physics', 'quantum', 'ebook'],
      category: 'Physics',
      level: 'Advanced',
      duration: 0,
      enrollments: 856,
      rating: 4.9,
      reviews: 89,
      createdDate: '2024-01-12T00:00:00Z',
      isPublished: true,
      type: 'ebook'
    },
    {
      id: '3',
      title: 'Free Programming Basics',
      description: 'Learn programming fundamentals with Python. Perfect for beginners.',
      thumbnailUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 0,
      currency: 'USD',
      instructorId: '3',
      instructorName: 'Mike Chen',
      videos: [
        { id: '1', title: 'Variables and Data Types', description: 'Understanding basic programming concepts', videoUrl: '', duration: 900, order: 1, isPreview: true }
      ],
      tags: ['programming', 'python', 'beginner'],
      category: 'Computer Science',
      level: 'Beginner',
      duration: 360,
      enrollments: 2341,
      rating: 4.7,
      reviews: 234,
      createdDate: '2024-01-08T00:00:00Z',
      isPublished: true,
      type: 'course'
    },
    {
      id: '4',
      title: 'Chemistry Lab Manual',
      description: 'Comprehensive lab manual for organic chemistry experiments.',
      thumbnailUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 15.99,
      currency: 'USD',
      instructorId: '5',
      instructorName: 'Alex Rodriguez',
      videos: [],
      tags: ['chemistry', 'lab', 'manual'],
      category: 'Chemistry',
      level: 'Intermediate',
      duration: 0,
      enrollments: 456,
      rating: 4.6,
      reviews: 67,
      createdDate: '2024-01-05T00:00:00Z',
      isPublished: true,
      type: 'ebook'
    },
    {
      id: '5',
      title: 'Biology Textbook - Used',
      description: 'Campbell Biology 12th Edition in good condition. Minor highlighting.',
      thumbnailUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 89.99,
      currency: 'USD',
      instructorId: '6',
      instructorName: 'Lisa Wang',
      videos: [],
      tags: ['biology', 'textbook', 'used'],
      category: 'Biology',
      level: 'Intermediate',
      duration: 0,
      enrollments: 12,
      rating: 4.3,
      reviews: 8,
      createdDate: '2024-01-03T00:00:00Z',
      isPublished: true,
      type: 'book'
    }
  ];

  const filteredCourses = allUserResources.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || course.category.toLowerCase() === filterCategory.toLowerCase();
    
    const matchesPrice = filterPrice === 'all' || 
                        (filterPrice === 'free' && course.price === 0) ||
                        (filterPrice === 'paid' && course.price > 0);

    const matchesType = filterType === 'all' || course.type === filterType;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesType;
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleEnrollCourse = (course: Course) => {
    if (!isLoggedIn) {
      if (onAddNotification) {
        onAddNotification({
          type: 'warning',
          title: 'Login Required',
          message: 'Login to Purchase courses and resources'
        });
      }
      return;
    }
    
    if (course.price === 0) {
      console.log('Enrolling in free course:', course.id);
      onPurchaseCourse(course.id);
    } else {
      onPurchaseCourse(course.id);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <Play className="w-4 h-4" />;
      case 'ebook': return <FileText className="w-4 h-4" />;
      case 'book': return <Book className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'course': return 'Course';
      case 'ebook': return 'eBook';
      case 'book': return 'Book';
      default: return 'Resource';
    }
  };

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'course': return 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
      case 'ebook': return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
      case 'book': return 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative">
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
            {i % 4 === 0 ? <BookOpen /> : 
             i % 4 === 1 ? <Book /> : 
             i % 4 === 2 ? <FileText /> : <Play />}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">EduStore</h2>
            <p className="text-gray-400">Discover courses, eBooks, textbooks and educational resources from our community</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search educational resources..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white"
                >
                  <option value="all">All Types</option>
                  <option value="course">Courses</option>
                  <option value="ebook">eBooks</option>
                  <option value="book">Books</option>
                </select>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Categories</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="computer science">Computer Science</option>
                <option value="biology">Biology</option>
              </select>
              <select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
                <img 
                  src={course.thumbnailUrl || getDefaultThumbnail(course.type)} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm hover:bg-opacity-30 transition-colors"
                  >
                    <Eye className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs rounded-full flex items-center space-x-1">
                  {getTypeIcon(course.type)}
                  <span>{getTypeLabel(course.type)}</span>
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                  {course.level}
                </div>
                {course.price === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                    FREE
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(course.type)}
                  <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors text-sm">
                    {course.title}
                  </h4>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCourse(course);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{course.description}</p>

              {/* Creator & Stats info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                    {course.instructorProfilePicture ? (
                      <img src={course.instructorProfilePicture} alt={course.instructorName} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{course.instructorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{course.enrollments}</span>
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-white">
                  {course.price === 0 ? (
                    <span className="text-blue-400">Free</span>
                  ) : (
                    <span>${course.price}</span>
                  )}
                </div>
                <button
                  onClick={() => handleEnrollCourse(course)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    course.price === 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{course.price === 0 ? 'Get Free' : 'Buy Now'}</span>
                </button>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No resources found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {/* Course Preview Modal */}
        {selectedCourse && (
          <CoursePreviewModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            onPurchaseCourse={handleEnrollCourse}
            isLoggedIn={isLoggedIn}
            onAddNotification={onAddNotification}
          />
        )}
      </div>

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