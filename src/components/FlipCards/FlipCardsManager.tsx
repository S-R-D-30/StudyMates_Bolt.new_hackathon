import React, { useState } from 'react';
import { Brain, Plus, Play, Trash2, FileText, Zap, RotateCw, Globe, Lock, Filter, Eye, Save, User, Tag, Upload, X, Link, Search } from 'lucide-react';
import type { FlipCardSet, Note, FlipCard } from '../../types';

interface FlipCardsManagerProps {
  flipCardSets: FlipCardSet[];
  notes: Note[];
  onCreateSet: (set: Omit<FlipCardSet, 'id'>) => void;
  onDeleteSet: (id: string) => void;
  showFilter?: boolean;
}

/**
 * FlipCard Preview Modal - Same design as PublicFlipCards.tsx and HomePage.tsx
 */
const FlipCardPreviewModal = ({ set, onClose, onDeleteSet }) => {
  if (!set) return null;

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'flipcard': return 'https://images.pexels.com/photos/4050306/pexels-photo-4050306.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/4050306/pexels-photo-4050306.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const handleCopyPrivateLink = () => {
    const privateLink = `${window.location.origin}/private/flipcard/${set.id}`;
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

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {set.tags?.map(tag => (
              <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => onDeleteSet(set.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Set</span>
            </button>
            {!set.isPublic && (
              <button
                onClick={handleCopyPrivateLink}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Link className="w-5 h-5" />
                <span>Copy Private Link</span>
              </button>
            )}
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

export default function FlipCardsManager({ 
  flipCardSets, 
  notes, 
  onCreateSet, 
  onDeleteSet, 
  showFilter = true 
}: FlipCardsManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [studyMode, setStudyMode] = useState<{ setId: string; cardIndex: number; showAnswer: boolean } | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'created' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedSet, setSelectedSet] = useState<FlipCardSet | null>(null);
  const [createData, setCreateData] = useState({
    title: '',
    noteId: '',
    isPublic: false,
    manualCards: [{ question: '', answer: '' }],
    thumbnailUrl: ''
  });

  // Filter flip card sets based on type
  const filteredSets = showFilter ? flipCardSets.filter(set => {
    switch (filterType) {
      case 'created':
        return set.userId === '1'; // Current user's created sets
      case 'saved':
        return set.userId !== '1'; // Saved from others
      default:
        return true; // All sets
    }
  }) : flipCardSets;

  const handleCreateSet = (e: React.FormEvent) => {
    e.preventDefault();
    
    let cards: FlipCard[];
    if (createData.noteId) {
      // AI-generated cards from note (simulated)
      const selectedNote = notes.find(n => n.id === createData.noteId);
      cards = [
        { id: '1', question: `What is the main topic of "${selectedNote?.title}"?`, answer: selectedNote?.summary || 'Main concepts and key points' },
        { id: '2', question: 'What are the key takeaways?', answer: 'Important principles and applications covered in the material' },
        { id: '3', question: 'How does this relate to other concepts?', answer: 'Connections to broader topics and interdisciplinary applications' }
      ];
    } else {
      // Manual cards
      cards = createData.manualCards
        .filter(card => card.question.trim() && card.answer.trim())
        .map((card, index) => ({ id: String(index + 1), ...card }));
    }

    const newSet: Omit<FlipCardSet, 'id'> = {
      title: createData.title,
      cards,
      noteId: createData.noteId || undefined,
      createdDate: new Date().toISOString(),
      userId: '1',
      userName: 'You',
      isPublic: createData.isPublic,
      posterUrl: createData.thumbnailUrl || undefined
    };

    onCreateSet(newSet);
    setCreateData({ title: '', noteId: '', isPublic: false, manualCards: [{ question: '', answer: '' }], thumbnailUrl: '' });
    setShowCreate(false);
  };

  const addManualCard = () => {
    setCreateData(prev => ({
      ...prev,
      manualCards: [...prev.manualCards, { question: '', answer: '' }]
    }));
  };

  const updateManualCard = (index: number, field: 'question' | 'answer', value: string) => {
    setCreateData(prev => ({
      ...prev,
      manualCards: prev.manualCards.map((card, i) => 
        i === index ? { ...card, [field]: value } : card
      )
    }));
  };

  const handleThumbnailUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCreateData(prev => ({
            ...prev,
            thumbnailUrl: e.target?.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const startStudy = (setId: string) => {
    setStudyMode({ setId, cardIndex: 0, showAnswer: false });
  };

  const nextCard = () => {
    if (!studyMode) return;
    const currentSet = flipCardSets.find(s => s.id === studyMode.setId);
    if (!currentSet) return;

    if (studyMode.cardIndex < currentSet.cards.length - 1) {
      setStudyMode({
        ...studyMode,
        cardIndex: studyMode.cardIndex + 1,
        showAnswer: false
      });
    } else {
      setStudyMode(null);
    }
  };

  const currentStudySet = studyMode ? flipCardSets.find(s => s.id === studyMode.setId) : null;
  const currentCard = currentStudySet?.cards[studyMode?.cardIndex || 0];

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'flipcard': return 'https://images.pexels.com/photos/4050306/pexels-photo-4050306.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/4050306/pexels-photo-4050306.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  if (studyMode && currentStudySet && currentCard) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{currentStudySet.title}</h2>
            <p className="text-gray-400">
              Card {studyMode.cardIndex + 1} of {currentStudySet.cards.length}
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-xl p-8 min-h-[400px] flex flex-col justify-center items-center text-center">
            <div className="mb-8">
              {studyMode.showAnswer ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-400 mb-4">Answer</h3>
                  <p className="text-xl text-white">{currentCard.answer}</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-400 mb-4">Question</h3>
                  <p className="text-xl text-white">{currentCard.question}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              {!studyMode.showAnswer ? (
                <button
                  onClick={() => setStudyMode({ ...studyMode, showAnswer: true })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2"
                >
                  <RotateCw className="w-5 h-5" />
                  <span>Reveal Answer</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={nextCard}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    {studyMode.cardIndex < currentStudySet.cards.length - 1 ? 'Next Card' : 'Finish'}
                  </button>
                  <button
                    onClick={() => setStudyMode({ ...studyMode, showAnswer: false })}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Review Question
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setStudyMode(null)}
              className="text-gray-400 hover:text-white font-medium transition-colors"
            >
              Exit Study Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Flip Card Sets</h2>
            <p className="text-gray-400">Create and study with AI-powered flashcards</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {showFilter && (
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'created' | 'saved')}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white text-sm"
                >
                  <option value="all">All Sets</option>
                  <option value="created">Created by Me</option>
                  <option value="saved">Saved Sets</option>
                </select>
              </div>
            )}
            <button
              onClick={() => setShowCreate(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create Flip Cards</span>
            </button>
          </div>
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
        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Create Flip Card Set</h3>
              
              <form onSubmit={handleCreateSet} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail Image (Optional)
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleThumbnailUpload}
                      className="flex-1 p-4 border-2 border-dashed border-gray-600 rounded-xl hover:border-purple-500 transition-colors flex flex-col items-center space-y-2 text-gray-400 hover:text-purple-400"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Upload Thumbnail</span>
                    </button>
                    {createData.thumbnailUrl && (
                      <div className="w-24 h-16 bg-gray-700 rounded-lg overflow-hidden">
                        <img src={createData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Set Title
                  </label>
                  <input
                    type="text"
                    value={createData.title}
                    onChange={(e) => setCreateData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Enter flip card set title"
                    required
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={createData.isPublic}
                    onChange={(e) => setCreateData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-300 flex items-center space-x-2">
                    {createData.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>Make this flip card set {createData.isPublic ? 'public' : 'private'}</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Generation Method
                  </label>
                  <div className="space-y-4">
                    <div className="border border-gray-600 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <span className="font-medium text-white">AI-Generated from Notes</span>
                      </div>
                      <select
                        value={createData.noteId}
                        onChange={(e) => setCreateData(prev => ({ ...prev, noteId: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white"
                      >
                        <option value="">Select a note to generate cards from</option>
                        {notes.map((note) => (
                          <option key={note.id} value={note.id}>{note.title}</option>
                        ))}
                      </select>
                    </div>

                    {createData.noteId === '' && (
                      <div className="border border-gray-600 rounded-xl p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Brain className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-white">Manual Creation</span>
                        </div>
                        
                        {createData.manualCards.map((card, index) => (
                          <div key={index} className="space-y-3 mb-4 p-4 bg-gray-800 rounded-lg">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Question {index + 1}
                              </label>
                              <input
                                type="text"
                                value={card.question}
                                onChange={(e) => updateManualCard(index, 'question', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                                placeholder="Enter question"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Answer {index + 1}
                              </label>
                              <textarea
                                value={card.answer}
                                onChange={(e) => updateManualCard(index, 'answer', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                                placeholder="Enter answer"
                              />
                            </div>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={addManualCard}
                          className="text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-2 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Another Card</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg"
                  >
                    Create Cards
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Flip Card Sets Grid - Updated to match HomePage design */}
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
                  {set.userId === '1' && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onDeleteSet(set.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Set"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3">
                {set.cards.length} cards
              </p>

              {/* Author & Visibility info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
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
                  {set.isPublic ? (
                    <Globe className="w-3 h-3 text-green-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                  <span>{set.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>

              <button
                onClick={() => startStudy(set.id)}
                className="w-full bg-purple-900/50 hover:bg-purple-800/50 text-purple-400 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Studying</span>
              </button>
            </div>
          ))}

          {filteredSets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {filterType === 'created' ? 'No created flip card sets yet' :
                 filterType === 'saved' ? 'No saved flip card sets yet' :
                 'No flip card sets yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {filterType === 'created' ? 'Create your first set of AI-powered flashcards' :
                 filterType === 'saved' ? 'Save flip card sets from the community' :
                 'Create your first set of AI-powered flashcards'}
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create Flip Cards</span>
              </button>
            </div>
          )}
        </div>

        {/* FlipCard Preview Modal */}
        {selectedSet && (
          <FlipCardPreviewModal
            set={selectedSet}
            onClose={() => setSelectedSet(null)}
            onDeleteSet={onDeleteSet}
          />
        )}
      </div>
    </div>
  );
}