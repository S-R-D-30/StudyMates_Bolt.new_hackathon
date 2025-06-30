import React, { useState } from 'react';
import { Brain, Search, Save, User, Calendar, ArrowLeft, Play, X, Eye, Filter } from 'lucide-react';
import type { FlipCardSet } from '../../types';

interface PublicFlipCardsProps {
  onNavigate: (view: string) => void;
  onSaveFlipCard: (setId: string) => void;
  isLoggedIn: boolean;
}

/**
 * A reusable modal component to display a detailed preview of a FlipCardSet.
 * Styled to match the ViewDetailsModal from HomePage.
 */
const FlipCardPreviewModal = ({ set, onClose, onSaveFlipCard, isLoggedIn }) => {
  if (!set) return null;

  // Helper function to get a default thumbnail if posterUrl is not available
  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'flipcard': return 'https://images.pexels.com/photos/4050306/pexels-photo-4050306.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/4050306/pexels-photo-4050306.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const handleSaveFlipCard = () => {
    if (isLoggedIn) {
      onSaveFlipCard(set.id);
    } else {
      alert('Please log in to save flip card sets');
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
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">{set.title}</h3>
            <span className="text-purple-400 font-medium">Flip Card Set Preview</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Flip card set poster/thumbnail */}
          <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden">
            <img src={set.posterUrl || getDefaultThumbnail('flipcard')} alt={set.title} className="w-full h-full object-cover" />
          </div>

          {/* Author and stats */}
          <div className="flex items-start space-x-3 text-gray-400">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              {set.userProfilePicture ? (
                <img src={set.userProfilePicture} alt={set.userName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-base font-medium text-gray-300">Created by {set.userName}</p>
              <p className="text-xs text-gray-500">on {new Date(set.createdDate).toLocaleDateString()} • {set.cards.length} cards</p>
            </div>
          </div>

          {/* Cards list */}
          <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 max-h-96 overflow-y-auto custom-scrollbar space-y-4">
            {set.cards.map((card, index) => (
              <div key={card.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-start space-x-3 mb-2">
                  <span className="flex-shrink-0 bg-purple-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">Q</span>
                  <p className="text-gray-200 font-medium">{card.question}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 bg-green-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">A</span>
                  <p className="text-gray-400">{card.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleSaveFlipCard}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Set</span>
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Start Study</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PublicFlipCards({ onNavigate, onSaveFlipCard, isLoggedIn }: PublicFlipCardsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSet, setSelectedSet] = useState<FlipCardSet | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Extended public flip card sets data with posterUrl
  const publicFlipCardSets: FlipCardSet[] = [
    {
      id: '1',
      title: 'Calculus Quick Review',
      cards: [
        { id: '1', question: 'What is a derivative?', answer: 'Rate of change of a function' },
        { id: '2', question: 'What is an integral?', answer: 'Area under a curve' },
        { id: '3', question: 'Chain rule formula', answer: 'd/dx[f(g(x))] = f\'(g(x)) × g\'(x)' }
      ],
      createdDate: '2024-01-16T09:00:00Z',
      userId: '2',
      userName: 'Sarah Johnson',
      userProfilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      isPublic: true,
      saves: 156,
      posterUrl: 'https://images.pexels.com/photos/5926392/pexels-photo-5926392.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['calculus', 'mathematics', 'derivatives']
    },
    {
      id: '2',
      title: 'Physics Formulas',
      cards: [
        { id: '1', question: 'Newton\'s Second Law', answer: 'F = ma' },
        { id: '2', question: 'Kinetic Energy Formula', answer: 'KE = ½mv²' },
        { id: '3', question: 'Wave equation', answer: 'v = fλ' },
        { id: '4', question: 'Einstein\'s Mass-Energy Equivalence', answer: 'E = mc²' }
      ],
      createdDate: '2024-01-15T14:30:00Z',
      userId: '4',
      userName: 'Emma Davis',
      userProfilePicture: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=150',
      isPublic: true,
      saves: 123,
      posterUrl: 'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['physics', 'formulas', 'equations']
    },
    {
      id: '3',
      title: 'Periodic Table Elements',
      cards: [
        { id: '1', question: 'Atomic number of Oxygen', answer: '8' },
        { id: '2', question: 'Symbol for Gold', answer: 'Au' },
        { id: '3', question: 'Halogens group number', answer: 'Group 17' }
      ],
      createdDate: '2024-01-14T11:00:00Z',
      userId: '5',
      userName: 'Alex Rodriguez',
      userProfilePicture: 'https://images.pexels.com/photos/1560932/pexels-photo-1560932.jpeg?auto=compress&cs=tinysrgb&w=150',
      isPublic: true,
      saves: 95,
      posterUrl: 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['chemistry', 'periodic-table', 'elements']
    },
    {
      id: '4',
      title: 'Computer Science Basics',
      cards: [
        { id: '1', question: 'What is a binary digit?', answer: 'A bit (0 or 1)' },
        { id: '2', question: 'What is an algorithm?', answer: 'A set of rules for solving a problem' },
        { id: '3', question: 'What is a variable?', answer: 'A storage location' }
      ],
      createdDate: '2024-01-13T16:00:00Z',
      userId: '3',
      userName: 'Mike Chen',
      userProfilePicture: 'https://images.pexels.com/photos/1594951/pexels-photo-1594951.jpeg?auto=compress&cs=tinysrgb&w=150',
      isPublic: true,
      saves: 210,
      posterUrl: 'https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
      tags: ['computer-science', 'programming', 'basics']
    },
  ];

  const filteredSets = publicFlipCardSets.filter(set => {
    const matchesSearch = set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         set.cards.some(card =>
                           card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.answer.toLowerCase().includes(searchQuery.toLowerCase())
                         ) ||
                         set.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = filterSubject === 'all' || 
                          set.tags?.some(tag => {
                            switch (filterSubject) {
                              case 'mathematics': return ['calculus', 'mathematics', 'algebra', 'geometry'].includes(tag.toLowerCase());
                              case 'physics': return ['physics', 'formulas', 'equations'].includes(tag.toLowerCase());
                              case 'chemistry': return ['chemistry', 'periodic-table', 'elements'].includes(tag.toLowerCase());
                              case 'computer science': return ['computer-science', 'programming', 'basics'].includes(tag.toLowerCase());
                              case 'biology': return ['biology', 'life-science'].includes(tag.toLowerCase());
                              default: return true;
                            }
                          });
    
    return matchesSearch && matchesSubject;
  });

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'flipcard': return 'https://images.pexels.com/photos/4050306/pexels-photo-4050306.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/4050306/pexels-photo-4050306.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const handleSaveFlipCardClick = (setId: string) => {
    onSaveFlipCard(setId);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Public Flip Card Sets</h2>
            <p className="text-gray-400">Discover and save flashcard sets shared by the community</p>
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
                placeholder="Search flip card sets by title, content, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white"
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

        {/* Flip Card Sets Grid - Updated to match HomePage.tsx format */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSets.map((set) => (
            <div key={set.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden">
                <img src={set.posterUrl || getDefaultThumbnail('flipcard')} alt={set.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              </div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors text-sm">
                    {set.title}
                  </h4>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSet(set);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Preview Set"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveFlipCardClick(set.id);
                    }}
                    className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                    title="Save Set"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3">
                {set.cards.length} cards
              </p>

              {/* Author & Saves info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
                    {set.userProfilePicture ? (
                      <img src={set.userProfilePicture} alt={set.userName} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{set.userName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Save className="w-3 h-3" />
                  <span>{set.saves}</span>
                </div>
              </div>

            </div>
          ))}

          {filteredSets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No flip card sets found</h3>
              <p className="text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {/* Flip Card Preview Modal */}
        {selectedSet && (
          <FlipCardPreviewModal
            set={selectedSet}
            onClose={() => setSelectedSet(null)}
            onSaveFlipCard={onSaveFlipCard}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  );
}