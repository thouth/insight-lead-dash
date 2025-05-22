
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

// Sample data for the recent leads
const recentLeads = [
  {
    company: "Norsk Bedrift AS",
    contact: "Ole Hansen",
    status: "Ny",
    kWp: "100 kWp",
    ppa: "1.25 kr/kWh",
    date: "15.03.2024"
  },
  {
    company: "Sol & Energi AS",
    contact: "Kari Olsen",
    status: "Kontaktet",
    kWp: "75 kWp",
    ppa: "1.15 kr/kWh",
    date: "14.03.2024"
  },
  {
    company: "Grønn Kraft AS",
    contact: "Per Nielsen",
    status: "Kvalifisert",
    kWp: "150 kWp",
    ppa: "1.20 kr/kWh",
    date: "13.03.2024"
  },
  {
    company: "Energi Partner AS",
    contact: "Lisa Berg",
    status: "Tilbud",
    kWp: "200 kWp",
    ppa: "1.18 kr/kWh",
    date: "12.03.2024"
  },
  {
    company: "Solcelle Tech AS",
    contact: "Ole Hansen",
    status: "Avsluttet",
    kWp: "85 kWp",
    ppa: "1.22 kr/kWh",
    date: "11.03.2024"
  }
];

export function RecentLeads() {
  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="flex justify-between items-center p-6 border-b">
        <h3 className="text-lg font-semibold">Nyeste leads</h3>
        <Button variant="ghost" size="sm">
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
        
        {recentLeads.map((lead, index) => (
          <div 
            key={index} 
            className="grid grid-cols-6 p-4 text-sm items-center border-b last:border-0"
          >
            <div>
              <p className="font-medium">{lead.company}</p>
              <p className="text-muted-foreground text-xs">{lead.contact}</p>
            </div>
            <div>
              <StatusBadge status={lead.status} />
            </div>
            <div>{lead.kWp}</div>
            <div>{lead.ppa}</div>
            <div>{lead.date}</div>
            <div className="flex justify-end">
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
