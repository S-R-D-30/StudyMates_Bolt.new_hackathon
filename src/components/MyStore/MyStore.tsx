import React, { useState } from 'react';
import { Play, Star, Clock, Users, DollarSign, Plus, Search, Filter, BookOpen, ShoppingCart, Eye, Heart, Book, FileText, X, User, ArrowLeft, Upload, Trash2, Link } from 'lucide-react';
import type { Course, User as UserType, Purchase } from '../../types';

interface MyStoreProps {
  user: UserType;
  purchases: Purchase[];
  savedCourses: Course[];
  onNavigate: (view: string) => void;
  onCreateResource?: (resource: Omit<Course, 'id' | 'instructorId' | 'enrollments' | 'rating' | 'reviews' | 'createdDate' | 'isPublished'>) => void;
  onDeleteResource?: (resourceId: string) => void;
}

/**
 * Course/Resource Preview Modal - Same design as other preview modals
 */
const CoursePreviewModal = ({ course, onClose, onDeleteResource, user }) => {
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

  const handleCopyPrivateLink = () => {
    const privateLink = `${window.location.origin}/private/resource/${course.id}`;
    navigator.clipboard.writeText(privateLink);
    alert('Private link copied to clipboard!');
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
            {course.instructorId === user.id && (
              <button
                onClick={() => onDeleteResource(course.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Resource</span>
              </button>
            )}
            
            <button
              onClick={handleCopyPrivateLink}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Link className="w-5 h-5" />
              <span>Copy Link</span>
            </button>
            
            <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Start Learning</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MyStore({ user, purchases, savedCourses, onNavigate, onCreateResource, onDeleteResource }: MyStoreProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'purchased' | 'created'>('all');
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    type: 'course' as 'course' | 'ebook' | 'book',
    category: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    price: 0,
    currency: 'USD',
    tags: '',
    thumbnailFile: null as File | null,
    resourceFile: null as File | null
  });

  // Combine created and purchased courses
  const allCourses = [...savedCourses, ...purchases.map(purchase => {
    // In a real app, you would fetch the actual course details from the backend
    // For this example, we'll create a mock course based on the purchase
    return {
      id: purchase.courseId,
      title: purchase.courseName,
      description: 'This is a purchased course.',
      thumbnailUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: purchase.amount,
      currency: purchase.currency,
      instructorId: '2',
      instructorName: 'Sarah Johnson',
      instructorProfilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      videos: [],
      tags: ['purchased'],
      category: 'Mathematics',
      level: 'Intermediate',
      duration: 480,
      enrollments: 1247,
      rating: 4.8,
      reviews: 156,
      createdDate: purchase.purchaseDate,
      isPublished: true,
      type: 'course',
      isPurchased: true
    };
  })];

  // Filter courses based on the selected filter type
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    switch (filterType) {
      case 'purchased':
        return (course as any).isPurchased === true && matchesSearch;
      case 'created':
        return course.instructorId === user.id && matchesSearch;
      default: // 'all'
        return matchesSearch;
    }
  });

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newResource = {
      title: createData.title,
      description: createData.description,
      thumbnailUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400', // Default or uploaded
      price: createData.price,
      currency: createData.currency,
      instructorName: user.name,
      instructorProfilePicture: user.profilePicture,
      videos: [], // Empty for now
      tags: createData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: createData.category,
      level: createData.level,
      duration: createData.type === 'course' ? 480 : 0, // Default duration for courses
      type: createData.type
    };
    
    if (onCreateResource) {
      onCreateResource(newResource);
    }
    
    console.log('Creating resource:', newResource);
    setShowCreateModal(false);
    setCreateData({
      title: '',
      description: '',
      type: 'course',
      category: '',
      level: 'Beginner',
      price: 0,
      currency: 'USD',
      tags: '',
      thumbnailFile: null,
      resourceFile: null
    });
  };

  const handleThumbnailUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setCreateData(prev => ({ ...prev, thumbnailFile: file }));
      }
    };
    input.click();
  };

  const handleResourceUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    
    // Set accept based on resource type
    if (createData.type === 'course') {
      input.accept = 'video/*';
    } else if (createData.type === 'ebook') {
      input.accept = '.pdf,.epub';
    } else {
      input.accept = 'image/*'; // For physical book, just upload an image
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setCreateData(prev => ({ ...prev, resourceFile: file }));
      }
    };
    input.click();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={() => onNavigate('profile')}
              className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button> */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">My Store</h2>
              <p className="text-gray-400">Manage your purchased and created educational resources</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Resource</span>
          </button>
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
                placeholder="Search your resources..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'purchased' | 'created')}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Resources</option>
                <option value="purchased">Purchased</option>
                <option value="created">Created by Me</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid - Using consistent card design */}
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
                {(course as any).isPurchased && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    Purchased
                  </div>
                )}
                {course.instructorId === user.id && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                    Created
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
                  {course.instructorId === user.id && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (onDeleteResource) onDeleteResource(course.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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

              {/* Action Button */}
              <button
                onClick={() => setSelectedCourse(course)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <Play className="w-4 h-4" />
                <span>{(course as any).isPurchased || course.instructorId === user.id ? 'Access Content' : 'View Details'}</span>
              </button>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {filterType === 'purchased' ? 'No purchased resources yet' :
                 filterType === 'created' ? 'No created resources yet' :
                 'No resources found'}
              </h3>
              <p className="text-gray-400 mb-6">
                {filterType === 'purchased' ? 'Browse the EduStore to find educational resources' :
                 filterType === 'created' ? 'Create your first educational resource to share with others' :
                 'Try adjusting your search terms or filters'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Resource</span>
              </button>
            </div>
          )}
        </div>

        {/* Create Resource Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Add Educational Resource</h3>
              
              <form onSubmit={handleCreateResource} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resource Type
                  </label>
                  <select 
                    value={createData.type}
                    onChange={(e) => setCreateData(prev => ({ ...prev, type: e.target.value as 'course' | 'ebook' | 'book' }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white"
                  >
                    <option value="course">Course (Video Content)</option>
                    <option value="ebook">eBook (Digital Book)</option>
                    <option value="book">Physical Book</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resource File Upload
                  </label>
                  <button
                    type="button"
                    onClick={handleResourceUpload}
                    className="w-full border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-green-500 transition-colors flex flex-col items-center space-y-2 text-gray-400 hover:text-green-400"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">
                      {createData.resourceFile ? createData.resourceFile.name : `Upload ${createData.type === 'course' ? 'video' : createData.type === 'ebook' ? 'PDF/ePub' : 'image'}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {createData.type === 'course' ? 'MP4, MOV up to 500MB' : 
                       createData.type === 'ebook' ? 'PDF, ePub up to 100MB' : 
                       'JPG, PNG for book cover'}
                    </span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleThumbnailUpload}
                    className="w-full border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-green-500 transition-colors flex flex-col items-center space-y-2 text-gray-400 hover:text-green-400"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">
                      {createData.thumbnailFile ? createData.thumbnailFile.name : 'Upload resource thumbnail'}
                    </span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={createData.title}
                    onChange={(e) => setCreateData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Enter resource title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={createData.description}
                    onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Describe your educational resource"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select 
                      value={createData.category}
                      onChange={(e) => setCreateData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white"
                      required
                    >
                      <option value="">Select category</option>
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
                      Level
                    </label>
                    <select 
                      value={createData.level}
                      onChange={(e) => setCreateData(prev => ({ ...prev, level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="e.g. calculus, mathematics, beginner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={createData.price}
                      onChange={(e) => setCreateData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="0.00 (Free) or set a price"
                    />
                  </div>
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
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg"
                  >
                    Add Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Course Preview Modal */}
        {selectedCourse && (
          <CoursePreviewModal
            course={selectedCourse}
            user={user}
            onClose={() => setSelectedCourse(null)}
            onDeleteResource={onDeleteResource}
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