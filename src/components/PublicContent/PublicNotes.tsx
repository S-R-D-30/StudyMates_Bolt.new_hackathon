import React, { useState } from 'react';
import { FileText, Search, Save, User, Calendar, Tag, ArrowLeft, Eye, Download, X, Filter } from 'lucide-react';
import type { Note } from '../../types';

interface PublicNotesProps {
  onNavigate: (view: string) => void;
  onSaveNote: (noteId: string) => void;
  isLoggedIn: boolean;
}

/**
 * A reusable modal component to display a detailed preview of a Note.
 * Styled to match the ViewDetailsModal from HomePage.
 */
const NotePreviewModal = ({ note, onClose, onSaveNote, isLoggedIn }) => {
  if (!note) return null;

  // Helper function to get a default thumbnail if posterUrl is not available
  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'note': return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const handleSaveNote = () => {
    if (isLoggedIn) {
      onSaveNote(note.id);
    } else {
      alert('Please log in to save notes');
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
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">{note.title}</h3>
            <span className="text-blue-400 font-medium">Note Preview</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Note poster/thumbnail */}
          <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden">
              <img src={note.posterUrl || getDefaultThumbnail('note')} alt={note.title} className="w-full h-full object-cover" />
          </div>

          {/* Author and stats */}
          <div className="flex items-start space-x-3 text-gray-400">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                  {note.userProfilePicture ? (
                      <img src={note.userProfilePicture} alt={note.userName} className="w-full h-full object-cover" />
                  ) : (
                      <User className="w-6 h-6 text-gray-500" />
                  )}
              </div>
              <div>
                  <p className="text-base font-medium text-gray-300">Uploaded by {note.userName}</p>
                  <p className="text-xs text-gray-500">on {new Date(note.uploadDate).toLocaleDateString()}</p>
              </div>
          </div>

          {/* Scrollable content area */}
          <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 max-h-96 overflow-y-auto custom-scrollbar">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{note.content || note.summary}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
              {note.tags?.map(tag => <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">{tag}</span>)}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleSaveNote}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Note</span>
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PublicNotes({ onNavigate, onSaveNote, isLoggedIn }: PublicNotesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Extended public notes data with posterUrl and more content for preview
  const publicNotes: Note[] = [
    {
      id: '1',
      title: 'Advanced Calculus Concepts',
      summary: 'Comprehensive guide to derivatives, integrals, and their applications in real-world scenarios.',
      content: `Calculus is the mathematical study of continuous change, in the same way that geometry is the study of shape and algebra is the study of generalizations of arithmetic operations. It has two major branches, differential calculus and integral calculus, which are related by the fundamental theorem of calculus.

      Differential calculus concerns instantaneous rates of change and the slopes of curves, while integral calculus concerns accumulation of quantities and areas under or between curves. These two branches are linked by the fundamental theorem of calculus, which states that differentiation and integration are inverse operations.

      Applications of differential calculus include computations involving velocity and acceleration, the slope of a curve, and optimization. Applications of integral calculus include computations involving area, volume, arc length, center of mass, and work.`,
      tags: ['calculus', 'mathematics', 'derivatives'],
      uploadDate: '2024-01-15T10:00:00Z',
      fileType: 'pdf',
      userId: '2',
      userName: 'Sarah Johnson',
      userProfilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      isPublic: true,
      saves: 234,
      posterUrl: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Quantum Physics Fundamentals',
      summary: 'Introduction to quantum mechanics, wave-particle duality, and quantum states.',
      content: `Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.

      The wave function, a mathematical function in quantum mechanics, provides information about the state of a quantum system. Its properties and evolution over time are governed by the Schrödinger equation, a central equation in quantum mechanics.`,
      tags: ['physics', 'quantum', 'mechanics'],
      uploadDate: '2024-01-14T15:30:00Z',
      fileType: 'pdf',
      userId: '4',
      userName: 'Emma Davis',
      userProfilePicture: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=150',
      isPublic: true,
      saves: 189,
      posterUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Organic Chemistry Reactions',
      summary: 'Complete guide to organic chemistry reaction mechanisms and synthesis.',
      content: `Organic chemistry is a subdiscipline of chemistry that studies the structure, properties, and reactions of organic compounds, which contain carbon–carbon covalent bonds.

      A reaction mechanism is the step-by-step sequence of elementary reactions by which overall chemical change occurs. Organic reactions are chemical reactions involving organic compounds. The basic types of organic reactions are addition reactions, elimination reactions, substitution reactions, pericyclic reactions, rearrangement reactions, photochemical reactions and redox reactions.`,
      tags: ['chemistry', 'organic', 'reactions'],
      uploadDate: '2024-01-13T12:00:00Z',
      fileType: 'pdf',
      userId: '5',
      userName: 'Alex Rodriguez',
      userProfilePicture: 'https://images.pexels.com/photos/1560932/pexels-photo-1560932.jpeg?auto=compress&cs=tinysrgb&w=150',
      isPublic: true,
      saves: 156,
      posterUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      title: 'Data Structures & Algorithms',
      summary: 'Essential data structures and algorithms for computer science students.',
      content: `In computer science, a data structure is a data organization, management, and storage format that is usually chosen for efficient access to data. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data.

      An algorithm is a finite sequence of rigorous instructions, typically used to solve a class of specific problems or to perform a computation. Algorithms are always unambiguous and are used as specifications for performing calculations, data processing, automated reasoning, and other tasks.`,
      tags: ['computer-science', 'algorithms', 'programming'],
      uploadDate: '2024-01-12T18:45:00Z',
      fileType: 'pdf',
      userId: '3',
      userName: 'Mike Chen',
      userProfilePicture: 'https://images.pexels.com/photos/1594951/pexels-photo-1594951.jpeg?auto=compress&cs=tinysrgb&w=150',
      isPublic: true,
      saves: 298,
      posterUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
  ];

  const filteredNotes = publicNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = filterSubject === 'all' || 
                          note.tags.some(tag => {
                            switch (filterSubject) {
                              case 'mathematics': return ['calculus', 'mathematics', 'algebra', 'geometry'].includes(tag.toLowerCase());
                              case 'physics': return ['physics', 'quantum', 'mechanics'].includes(tag.toLowerCase());
                              case 'chemistry': return ['chemistry', 'organic', 'reactions'].includes(tag.toLowerCase());
                              case 'computer science': return ['computer-science', 'algorithms', 'programming'].includes(tag.toLowerCase());
                              case 'biology': return ['biology', 'life-science'].includes(tag.toLowerCase());
                              default: return true;
                            }
                          });
    
    return matchesSearch && matchesSubject;
  });

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'note': return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const handleSaveNoteClick = (noteId: string) => {
    onSaveNote(noteId);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Public Notes</h2>
            <p className="text-gray-400">Discover and save notes shared by the community</p>
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
                placeholder="Search notes by title, description, or tags..."
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

        {/* Notes Grid - Updated to match HomePage.tsx format */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:shadow-lg transition-all duration-200 group">
              <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden">
                <img src={note.posterUrl || getDefaultThumbnail('note')} alt={note.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              </div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                    {note.title}
                  </h4>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedNote(note);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveNoteClick(note.id);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                    title="Save Note"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{note.summary}</p>

              {/* Author & Saves info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    {note.userProfilePicture ? (
                      <img src={note.userProfilePicture} alt={note.userName} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{note.userName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Save className="w-3 h-3" />
                  <span>{note.saves}</span>
                </div>
              </div>

            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No notes found</h3>
              <p className="text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {/* Note Preview Modal */}
        {selectedNote && (
          <NotePreviewModal
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onSaveNote={onSaveNote}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  );
}