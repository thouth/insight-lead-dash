
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { useNavigate } from 'react-router-dom';

export function RecentLeads() {
  const { data: leads, isLoading } = useLeads();
  const navigate = useNavigate();
  
  const recentLeads = leads?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Nyeste leads</h3>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="flex justify-between items-center p-6 border-b">
        <h3 className="text-lg font-semibold">Nyeste leads</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
          Se alle <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-0">
        <div className="grid grid-cols-6 p-4 text-sm font-medium text-muted-foreground border-b">
          <div>Firmanavn</div>
          <div>Status</div>
          <div>kWp</div>
          <div>PPA pris</div>
          <div>Dato</div>
          <div></div>
        </div>
        
        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>Ingen leads funnet</p>
            <p className="text-sm">Importer en Excel-fil for å komme i gang</p>
          </div>
        ) : (
          recentLeads.map((lead) => (
            <div 
              key={lead.id} 
              className="grid grid-cols-6 p-4 text-sm items-center border-b last:border-0"
            >
              <div>
                <p className="font-medium">{lead.company}</p>
                <p className="text-muted-foreground text-xs">{lead.contact || 'Ingen kontakt'}</p>
              </div>
              <div>
                <StatusBadge status={lead.status} />
              </div>
              <div>{lead.kwp ? `${lead.kwp} kWp` : '-'}</div>
              <div>{lead.ppa_price ? `${lead.ppa_price} kr/kWh` : '-'}</div>
              <div>{new Date(lead.date).toLocaleDateString('nb-NO')}</div>
              <div className="flex justify-end">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
