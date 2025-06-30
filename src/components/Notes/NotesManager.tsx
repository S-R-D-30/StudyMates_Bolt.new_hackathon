import React, { useState } from 'react';
import { Upload, Search, FileText, Tag, Calendar, Download, Trash2, Plus, Eye, Maximize2, X, File, Globe, Lock, User, Save, Link, Filter } from 'lucide-react';
import type { Note } from '../../types';

interface NotesManagerProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id'>) => void;
  onDeleteNote: (id: string) => void;
}

/**
 * Note Preview Modal - Same design as PublicNotes.tsx and HomePage.tsx
 */
const NotePreviewModal = ({ note, onClose, onDeleteNote }) => {
  if (!note) return null;

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'note': return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const handleDownload = () => {
    // Create a blob with the note content
    const content = `${note.title}\n\n${note.summary}\n\n${note.content || ''}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyPrivateLink = () => {
    const privateLink = `${window.location.origin}/private/note/${note.id}`;
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
            {note.tags?.map(tag => (
              <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
            {!note.isPublic && (
              <button
                onClick={handleCopyPrivateLink}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Link className="w-5 h-5" />
                <span>Copy Private Link</span>
              </button>
            )}
            <button
              onClick={() => onDeleteNote(note.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NotesManager({ notes, onAddNote, onDeleteNote }: NotesManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    summary: '',
    tags: '',
    fileType: 'pdf' as 'pdf' | 'text' | 'image',
    content: '',
    isPublic: false,
    thumbnailUrl: ''
  });

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'public' && note.isPublic) ||
      (filterType === 'private' && !note.isPublic);
    
    return matchesSearch && matchesFilter;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: Omit<Note, 'id'> = {
      title: uploadData.title,
      summary: uploadData.summary,
      content: uploadData.content || 'Sample note content...',
      tags: uploadData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      uploadDate: new Date().toISOString(),
      fileType: uploadData.fileType,
      userId: '1',
      userName: 'You',
      isPublic: uploadData.isPublic,
      posterUrl: uploadData.thumbnailUrl || undefined
    };
    
    onAddNote(newNote);
    setUploadData({ title: '', summary: '', tags: '', fileType: 'pdf', content: '', isPublic: false, thumbnailUrl: '' });
    setShowUpload(false);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.txt,.doc,.docx,.png,.jpg,.jpeg';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate file processing
        setUploadData(prev => ({
          ...prev,
          title: file.name.split('.')[0],
          fileType: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'text'
        }));
      }
    };
    input.click();
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
          setUploadData(prev => ({
            ...prev,
            thumbnailUrl: e.target?.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const getDefaultThumbnail = (type: string) => {
    switch (type) {
      case 'note': return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
      default: return 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Notes</h2>
            <p className="text-gray-400">Organize and manage your study materials</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Notes</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, content, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'public' | 'private')}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
              >
                <option value="all">All Notes</option>
                <option value="public">Public Notes</option>
                <option value="private">Private Notes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid - Updated to match HomePage design */}
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
                      onDeleteNote(note.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{note.summary}</p>

              {/* Author & Visibility info */}
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
                  {note.isPublic ? (
                    <Globe className="w-3 h-3 text-green-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                  <span>{note.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchQuery ? 'No matching notes found' : 'No notes uploaded yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'Upload your first study material to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors shadow-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Notes</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Upload New Notes</h3>
              
              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload File
                  </label>
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    className="w-full p-8 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-500 transition-colors flex flex-col items-center space-y-2 text-gray-400 hover:text-blue-400"
                  >
                    <File className="w-8 h-8" />
                    <span>Click to upload or drag and drop</span>
                    <span className="text-sm">PDF, DOC, TXT, or Image files</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail Image (Optional)
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleThumbnailUpload}
                      className="flex-1 p-4 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-500 transition-colors flex flex-col items-center space-y-2 text-gray-400 hover:text-blue-400"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Upload Thumbnail</span>
                    </button>
                    {uploadData.thumbnailUrl && (
                      <div className="w-24 h-16 bg-gray-700 rounded-lg overflow-hidden">
                        <img src={uploadData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Enter note title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Summary
                  </label>
                  <textarea
                    value={uploadData.summary}
                    onChange={(e) => setUploadData(prev => ({ ...prev, summary: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Brief summary of the content"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={uploadData.tags}
                    onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="mathematics, calculus, chapter-1"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={uploadData.isPublic}
                    onChange={(e) => setUploadData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-300 flex items-center space-x-2">
                    {uploadData.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>Make this note {uploadData.isPublic ? 'public' : 'private'}</span>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Note Preview Modal */}
        {selectedNote && (
          <NotePreviewModal
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onDeleteNote={onDeleteNote}
          />
        )}
      </div>
    </div>
  );
}