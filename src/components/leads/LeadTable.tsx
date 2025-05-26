
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Filter, Plus, Search } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';

export function LeadTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: leads, isLoading } = useLeads();
  
  const filteredLeads = leads?.filter(lead => 
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.org_number.includes(searchQuery) ||
    (lead.contact && lead.contact.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];
  
  const columns = [
    {
      id: "date",
      header: "Dato",
      cell: (row: any) => <span>{new Date(row.date).toLocaleDateString('nb-NO')}</span>,
    },
    {
      id: "company",
      header: "Firmanavn",
      cell: (row: any) => <span>{row.company}</span>,
    },
    {
      id: "orgNumber",
      header: "Org.nr",
      cell: (row: any) => <span>{row.org_number}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row: any) => <StatusBadge status={row.status} />,
    },
    {
      id: "source",
      header: "Kanal",
      cell: (row: any) => <span>{row.source}</span>,
    },
    {
      id: "seller",
      header: "Ansvarlig selger",
      cell: (row: any) => <span>{row.seller}</span>,
    },
    {
      id: "customer",
      header: "Eksisterende kunde",
      cell: (row: any) => <span>{row.is_existing_customer ? 'Ja' : 'Nei'}</span>,
    },
    {
      id: "kWp",
      header: "kWp",
      cell: (row: any) => <span>{row.kwp || '-'}</span>,
    },
    {
      id: "ppa",
      header: "PPA pris",
      cell: (row: any) => <span>{row.ppa_price || '-'}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <Button variant="ghost" size="icon">
          <span className="sr-only">Open menu</span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
          >
            <path
              d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
              fill="currentColor"
            ></path>
          </svg>
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded"></div>
        <div className="h-96 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Søk leads..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>
      
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? 'Ingen leads matcher søket' : 'Ingen leads funnet'}
          </p>
          {!searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Importer en Excel-fil for å komme i gang
            </p>
          )}
        </div>
      ) : (
        <DataTable data={filteredLeads} columns={columns} />
      )}
    </div>
  );
}
