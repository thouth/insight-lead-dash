
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ProcessingResultProps {
  processingResult: {
    validLeads: any[];
    errors: string[];
    totalRows: number;
  } | null;
}

export function ProcessingResult({ processingResult }: ProcessingResultProps) {
  if (!processingResult) return null;

  return (
    <div className="space-y-2">
      {processingResult.validLeads.length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Found {processingResult.validLeads.length} valid leads out of {processingResult.totalRows} rows
          </AlertDescription>
        </Alert>
      )}
      
      {processingResult.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p>{processingResult.errors.length} errors found:</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                {processingResult.errors.slice(0, 5).map((error: string, index: number) => (
                  <li key={index}>{error}</li>
                ))}
                {processingResult.errors.length > 5 && (
                  <li>... and {processingResult.errors.length - 5} more errors</li>
                )}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
