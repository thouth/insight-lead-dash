
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

const contractStatusColors = {
  signert: 'bg-green-500',
  avslatt: 'bg-red-500',
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('SortableCard clicked:', card.name);
    onClick();
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
      onClick={handleClick}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm leading-tight">
            {card.name}
          </h4>
          <div className="flex flex-col gap-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${priorityColors[card.priority]}`}
            >
              {card.priority}
            </Badge>
            {card.contract_status && (
              <div 
                className={`w-full h-3 rounded ${contractStatusColors[card.contract_status]}`}
                title={card.contract_status === 'signert' ? 'Signert' : 'Avslått'}
              />
            )}
          </div>
        </div>
        
        {card.assigned_to && (
          <p className="text-xs text-muted-foreground">
            Tildelt: {card.assigned_to}
          </p>
        )}
      </div>
    </Card>
  );
}
