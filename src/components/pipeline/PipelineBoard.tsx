
import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { usePipelineCards, useUpdatePipelineCard, PipelineCard } from '@/hooks/usePipelineCards';
import { PipelineColumn } from './PipelineColumn';
import { SortableCard } from './SortableCard';
import { CardDialog } from './CardDialog';

const pipelineColumns = [
  { id: 'not_started', title: 'Ikke startet' },
  { id: 'mapping', title: 'Kartlegging' },
  { id: 'quote_phase', title: 'Tilbudsfase' },
  { id: 'negotiation', title: 'Forhandling' },
  { id: 'parked', title: 'Parkert' },
  { id: 'closed', title: 'Avsluttet' }
];

export function PipelineBoard() {
  const { data: cards = [], isLoading } = usePipelineCards();
  const updateMutation = useUpdatePipelineCard();
  const [activeCard, setActiveCard] = useState<PipelineCard | null>(null);
  const [selectedCard, setSelectedCard] = useState<PipelineCard | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {pipelineColumns.map((column) => (
          <div key={column.id} className="h-96 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  const getCardsForColumn = (stage: string) => {
    return cards.filter(card => card.stage === stage);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find(c => c.id === event.active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCard = cards.find(c => c.id === active.id);
    if (!activeCard) return;

    const overId = String(over.id);
    
    // Check if dropped on a column
    const targetColumn = pipelineColumns.find(col => col.id === overId);
    if (targetColumn && activeCard.stage !== targetColumn.id) {
      updateMutation.mutate({
        id: activeCard.id,
        stage: targetColumn.id as PipelineCard['stage']
      });
    }
  };

  const handleCardClick = (card: PipelineCard) => {
    setSelectedCard(card);
    setShowEditDialog(true);
  };

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {pipelineColumns.map((column) => (
            <PipelineColumn
              key={column.id}
              id={column.id}
              title={column.title}
              cards={getCardsForColumn(column.id)}
              onCardClick={handleCardClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard && (
            <SortableCard
              card={activeCard}
              onClick={() => {}}
            />
          )}
        </DragOverlay>
      </DndContext>

      <CardDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        card={selectedCard || undefined}
      />
    </>
  );
}
