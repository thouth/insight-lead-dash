
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PipelineCard, CreatePipelineCard, useCreatePipelineCard, useUpdatePipelineCard, useDeletePipelineCard } from '@/hooks/usePipelineCards';
import { NotesSection } from './NotesSection';
import { Trash2 } from 'lucide-react';

interface CardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: PipelineCard;
  defaultStage?: PipelineCard['stage'];
}

const stageOptions = [
  { value: 'not_started', label: 'Ikke startet' },
  { value: 'mapping', label: 'Kartlegging' },
  { value: 'quote_phase', label: 'Tilbudsfase' },
  { value: 'negotiation', label: 'Forhandling' },
  { value: 'parked', label: 'Parkert' },
  { value: 'closed', label: 'Avsluttet' },
];

const priorityOptions = [
  { value: 'H', label: 'Høy (H)' },
  { value: 'M', label: 'Medium (M)' },
  { value: 'L', label: 'Lav (L)' },
];

export function CardDialog({ open, onOpenChange, card, defaultStage }: CardDialogProps) {
  const [name, setName] = useState('');
  const [stage, setStage] = useState<PipelineCard['stage']>(defaultStage || 'not_started');
  const [priority, setPriority] = useState<PipelineCard['priority']>('M');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [dateCreated, setDateCreated] = useState('');

  const createMutation = useCreatePipelineCard();
  const updateMutation = useUpdatePipelineCard();
  const deleteMutation = useDeletePipelineCard();

  useEffect(() => {
    if (card) {
      setName(card.name);
      setStage(card.stage);
      setPriority(card.priority);
      setAssignedTo(card.assigned_to || '');
      setNotes(card.notes || '');
      setDateCreated(card.date_created);
    } else {
      setName('');
      setStage(defaultStage || 'not_started');
      setPriority('M');
      setAssignedTo('');
      setNotes('');
      setDateCreated(new Date().toISOString().split('T')[0]);
    }
  }, [card, defaultStage, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cardData: CreatePipelineCard = {
      name,
      stage,
      priority,
      assigned_to: assignedTo || undefined,
      notes: notes || undefined,
      date_created: dateCreated,
    };

    try {
      if (card) {
        await updateMutation.mutateAsync({ id: card.id, ...cardData });
      } else {
        await createMutation.mutateAsync(cardData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleDelete = async () => {
    if (card && window.confirm('Er du sikker på at du vil slette dette kortet?')) {
      try {
        await deleteMutation.mutateAsync(card.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {card ? 'Rediger kort' : 'Nytt kort'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Navn *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Skriv inn navn"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateCreated">Dato</Label>
              <Input
                id="dateCreated"
                type="date"
                value={dateCreated}
                onChange={(e) => setDateCreated(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Fremdrift</Label>
              <Select value={stage} onValueChange={(value) => setStage(value as PipelineCard['stage'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Prioritet</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as PipelineCard['priority'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Tildelt</Label>
            <Input
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Hvem er kortet tildelt?"
            />
          </div>

          <NotesSection 
            notes={notes}
            onNotesChange={setNotes}
          />

          {card && (
            <div className="text-sm text-muted-foreground">
              <p>Opprettet: {new Date(card.date_created).toLocaleDateString('nb-NO')}</p>
              <p>Oppdatert: {new Date(card.date_updated).toLocaleDateString('nb-NO')} {new Date(card.date_updated).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div>
              {card && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Slett
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Avbryt
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {card ? 'Oppdater' : 'Opprett'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
