
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { PipelineCard } from '@/hooks/usePipelineCards';
import { SortableCard } from './SortableCard';
import { CardDialog } from './CardDialog';

interface PipelineColumnProps {
  id: string;
  title: string;
  cards: PipelineCard[];
  onCardClick: (card: PipelineCard) => void;
}

export function PipelineColumn({ id, title, cards, onCardClick }: PipelineColumnProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { setNodeRef } = useDroppable({ id });

  return (
    <>
      <Card className="h-fit min-h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {title}
              <Badge variant="secondary" className="ml-2">
                {cards.length}
              </Badge>
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-3">
          <div
            ref={setNodeRef}
            className="min-h-[400px] space-y-3"
          >
            <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {cards.map((card) => (
                <SortableCard
                  key={card.id}
                  card={card}
                  onClick={() => onCardClick(card)}
                />
              ))}
            </SortableContext>
            
            {cards.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                Ingen kort
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CardDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        defaultStage={id as PipelineCard['stage']}
      />
    </>
  );
}
