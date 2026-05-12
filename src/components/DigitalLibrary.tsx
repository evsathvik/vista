import React, { useState } from 'react';
import { Book, Upload, Download, Tag, Trash2, Search } from 'lucide-react';
import { useStore } from '../store';
import { Note } from '../types';

export default function DigitalLibrary() {
  const { user, addNote, deleteNote } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    tags: [],
    courseId: ''
  });
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && newNote.tags) {
      setNewNote({
        ...newNote,
        tags: [...newNote.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (newNote.tags) {
      setNewNote({
        ...newNote,
        tags: newNote.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const handleSubmit = () => {
    if (newNote.title && newNote.courseId) {
      const note: Note = {
        ...newNote,
        id: crypto.randomUUID(),
        uploadDate: new Date().toISOString(),
        tags: newNote.tags || []
      } as Note;
      
      addNote(note);
      setNewNote({
        title: '',
        content: '',
        tags: [],
        courseId: selectedCourseId
      });
    }
  };

  const filteredNotes = user?.notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCourse = !selectedCourseId || note.courseId === selectedCourseId;
    
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Book className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold">Digital Library</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add New Note Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Add New Note</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <select
              value={newNote.courseId}
              onChange={(e) => setNewNote({ ...newNote, courseId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a course</option>
              {user?.courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Note title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={4}
              placeholder="Write your note here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add tags"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>
            {newNote.tags && newNote.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newNote.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Upload className="w-4 h-4" />
            Save Note
          </button>
        </div>

        {/* Notes List */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Search notes..."
                />
              </div>
            </div>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Courses</option>
              {user?.courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {filteredNotes?.map(note => {
              const course = user?.courses.find(c => c.id === note.courseId);
              return (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{note.title}</h4>
                      <p className="text-sm text-gray-600">{course?.name}</p>
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 mb-2">{note.content}</p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(note.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
            {filteredNotes?.length === 0 && (
              <p className="text-center text-gray-500">No notes found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}