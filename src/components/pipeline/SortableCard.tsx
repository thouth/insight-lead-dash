
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PipelineCard } from '@/hooks/usePipelineCards';

interface SortableCardProps {
  card: PipelineCard;
  onClick: () => void;
}

const priorityColors = {
  H: 'bg-red-100 text-red-800 border-red-200',
  M: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  L: 'bg-green-100 text-green-800 border-green-200',
};

export function SortableCard({ card, onClick }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm leading-tight">
            {card.name}
          </h4>
          <Badge 
            variant="outline" 
            className={`text-xs ${priorityColors[card.priority]}`}
          >
            {card.priority}
          </Badge>
        </div>
        
        {card.assigned_to && (
          <p className="text-xs text-muted-foreground">
            Tildelt: {card.assigned_to}
          </p>
        )}
        
        {card.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {card.notes}
          </p>
        )}
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {new Date(card.date_created).toLocaleDateString('nb-NO')}
          </span>
          <span>
            Oppdatert: {new Date(card.date_updated).toLocaleDateString('nb-NO')}
          </span>
        </div>
      </div>
    </Card>
  );
}
