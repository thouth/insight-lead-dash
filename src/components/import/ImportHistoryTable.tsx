
import { useImportHistory } from '@/hooks/useImportHistory';
import { File, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ImportHistoryTable() {
  const { data: importHistory, isLoading, error } = useImportHistory();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading import history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Failed to load import history</p>
        <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
      </div>
    );
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-4 p-3 text-sm font-medium text-muted-foreground border-b bg-muted/40">
        <div>File</div>
        <div>Date</div>
        <div>Status</div>
        <div>Records</div>
      </div>
      
      {importHistory.map((item) => (
        <div key={item.id} className="grid grid-cols-4 p-3 text-sm border-b last:border-0 hover:bg-muted/20">
          <div className="flex items-center min-w-0">
            <File className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate" title={item.fileName}>{item.fileName}</span>
          </div>
          <div className="text-muted-foreground">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </div>
          <div className="flex items-center">
            {getStatusIcon(item.status)}
            <span 
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                item.status === "completed" ? "bg-green-500/20 text-green-500" :
                item.status === "processing" ? "bg-blue-500/20 text-blue-500" :
                "bg-red-500/20 text-red-500"
              }`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium">{item.totalRows}</span>
            </div>
            {item.validRows > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Valid:</span>
                <span className="font-medium">{item.validRows}</span>
              </div>
            )}
            {item.errorRows > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Errors:</span>
                <span className="font-medium">{item.errorRows}</span>
              </div>
            )}
            {item.skippedRows > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Skipped:</span>
                <span className="font-medium">{item.skippedRows}</span>
              </div>
            )}
            {item.errorMessage && (
              <div className="text-red-500 text-xs mt-1" title={item.errorMessage}>
                <span className="truncate block">Error: {item.errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
