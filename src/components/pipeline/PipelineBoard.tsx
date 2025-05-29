
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLeads } from '@/hooks/useLeads';

const pipelineColumns = [
  { id: 'not_started', title: 'Ikke startet', status: 'new' },
  { id: 'mapping', title: 'Kartlegging', status: 'qualified' },
  { id: 'quote_phase', title: 'Tilbudsfase', status: 'proposal' },
  { id: 'negotiation', title: 'Forhandling', status: 'negotiation' },
  { id: 'parked', title: 'Parkert', status: 'on_hold' },
  { id: 'closed', title: 'Avsluttet', status: 'closed' }
];

export function PipelineBoard() {
  const { data: leads, isLoading } = useLeads();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {pipelineColumns.map((column) => (
          <div key={column.id} className="h-96 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  const getLeadsForColumn = (status: string) => {
    return leads?.filter(lead => lead.status === status) || [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {pipelineColumns.map((column) => {
        const columnLeads = getLeadsForColumn(column.status);
        
        return (
          <Card key={column.id} className="h-fit min-h-[400px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-center">
                {column.title}
                <Badge variant="secondary" className="ml-2">
                  {columnLeads.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ScrollArea className="h-[350px]">
                <div className="space-y-3">
                  {columnLeads.map((lead) => (
                    <Card key={lead.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm leading-tight">
                          {lead.company}
                        </h4>
                        {lead.contact && (
                          <p className="text-xs text-muted-foreground">
                            {lead.contact}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">
                            {lead.kwp ? `${lead.kwp} kWp` : 'N/A'}
                          </span>
                          {lead.ppa_price && (
                            <span className="font-medium">
                              {lead.ppa_price} kr/kWh
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {lead.source}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(lead.date).toLocaleDateString('nb-NO')}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {columnLeads.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      Ingen leads
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
