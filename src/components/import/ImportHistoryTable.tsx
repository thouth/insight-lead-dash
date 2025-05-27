
import { useImportHistory } from '@/hooks/useImportHistory';
import { File } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ImportHistoryTable() {
  const { data: importHistory, isLoading } = useImportHistory();

  if (isLoading) {
    return <div className="text-center py-4">Loading import history...</div>;
  }

  if (!importHistory || importHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No import history yet</p>
        <p className="text-sm">Upload your first Excel file to see import records here</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-4 p-3 text-sm font-medium text-muted-foreground border-b bg-muted/40">
        <div>File</div>
        <div>Date</div>
        <div>Status</div>
        <div>Records</div>
      </div>
      
      {importHistory.map((item) => (
        <div key={item.id} className="grid grid-cols-4 p-3 text-sm border-b last:border-0">
          <div className="flex items-center">
            <File className="h-4 w-4 mr-2" />
            <span className="truncate">{item.fileName}</span>
          </div>
          <div>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</div>
          <div>
            <span 
              className={`px-2 py-1 rounded-full text-xs ${
                item.status === "completed" ? "bg-green-500/20 text-green-500" :
                item.status === "processing" ? "bg-blue-500/20 text-blue-500" :
                "bg-red-500/20 text-red-500"
              }`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>
          <div className="text-xs">
            <div>Valid: {item.validRows}</div>
            {item.errorRows > 0 && <div className="text-red-500">Errors: {item.errorRows}</div>}
            {item.skippedRows > 0 && <div className="text-gray-500">Skipped: {item.skippedRows}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
