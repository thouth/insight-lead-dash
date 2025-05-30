import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Note {
  id: string;
  content: string;
  timestamp: string;
}

interface NotesSectionProps {
  notes: string | null;
  onNotesChange: (notes: string) => void;
}

export function NotesSection({ notes, onNotesChange }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');

  // Parse existing notes (stored as JSON string)
  const parseNotes = (notesString: string | null): Note[] => {
    if (!notesString) return [];
    try {
      return JSON.parse(notesString);
    } catch {
      // If it's not JSON, treat as legacy single note
      return notesString ? [{ 
        id: '1', 
        content: notesString, 
        timestamp: new Date().toISOString() 
      }] : [];
    }
  };

  const existingNotes = parseNotes(notes);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      timestamp: new Date().toISOString()
    };
    
    const updatedNotes = [...existingNotes, note];
    onNotesChange(JSON.stringify(updatedNotes));
    setNewNote('');
  };

  const removeNote = (noteId: string) => {
    const updatedNotes = existingNotes.filter(note => note.id !== noteId);
    onNotesChange(JSON.stringify(updatedNotes));
  };

  return (
    <div className="space-y-4">
      <Label>Notater</Label>
      
      {/* Existing notes */}
      {existingNotes.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {existingNotes.map((note) => (
            <div key={note.id} className="p-3 border rounded-md bg-muted/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(note.timestamp).toLocaleString('nb-NO')}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNote(note.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  ×
                </Button>
              </div>
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Add new note */}
      <div className="space-y-2">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Legg til ny kommentar..."
          rows={3}
        />
        <Button
          type="button"
          onClick={addNote}
          disabled={!newNote.trim()}
          size="sm"
        >
          Legg til kommentar
        </Button>
      </div>
    </div>
  );
}
