
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';

const importHistory = [
  {
    id: 1,
    source: "File",
    fileName: "leads-q2-2023.xlsx",
    date: "Jun 15, 2023",
    status: "Completed",
    records: 238
  },
  {
    id: 2,
    source: "Email",
    fileName: "Gmail Import",
    date: "Jun 12, 2023",
    status: "Completed",
    records: 42
  },
  {
    id: 3,
    source: "API",
    fileName: "HubSpot Sync",
    date: "Jun 10, 2023",
    status: "Processing",
    records: null
  },
  {
    id: 4,
    source: "File",
    fileName: "conference-leads.csv",
    date: "Jun 8, 2023",
    status: "Failed",
    records: null
  },
  {
    id: 5,
    source: "File",
    fileName: "marketing-leads.xlsx",
    date: "Jun 5, 2023",
    status: "Completed",
    records: 156
  }
];

export function ImportHistoryTable() {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-5 p-3 text-sm font-medium text-muted-foreground border-b bg-muted/40">
        <div>Source</div>
        <div>File/Description</div>
        <div>Date</div>
        <div>Status</div>
        <div>Records</div>
      </div>
      
      {importHistory.map((item) => (
        <div key={item.id} className="grid grid-cols-5 p-3 text-sm border-b last:border-0">
          <div className="flex items-center">
            {item.source === "File" ? (
              <File className="h-4 w-4 mr-2" />
            ) : item.source === "Email" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 18l-7.5-7.5-9 9L3 16.5 12 7.5l7.5 7.5M3 16.5l1.5 1.5M21.5 18l-1.5-1.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.23 0 .46.05.68L3 21l4.5-1.5c.96.56 2.45.9 3.5.9 4.11 0 10-2.5 10-8.18z" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            )}
            {item.source}
          </div>
          <div>{item.fileName}</div>
          <div>{item.date}</div>
          <div>
            <span 
              className={`px-2 py-1 rounded-full text-xs ${
                item.status === "Completed" ? "bg-green-500/20 text-green-500" :
                item.status === "Processing" ? "bg-blue-500/20 text-blue-500" :
                "bg-red-500/20 text-red-500"
              }`}
            >
              {item.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            {item.records !== null ? item.records : "-"}
            
            {item.status === "Failed" && (
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                Retry
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
