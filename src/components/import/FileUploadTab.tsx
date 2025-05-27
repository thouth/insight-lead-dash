
import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { FileUploadSection } from './FileUploadSection';
import { ProcessingResult } from './ProcessingResult';
import { processExcelFile } from '@/utils/excelProcessor';
import { useUpsertLeads } from '@/hooks/useLeads';
import { useCreateImportRecord } from '@/hooks/useImportHistory';
import { toast } from '@/hooks/use-toast';

export function FileUploadTab() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<any>(null);
  
  const upsertLeads = useUpsertLeads();
  const createImportRecord = useCreateImportRecord();

  const handleImport = async () => {
    if (!file) return;
    
    setProcessing(true);
    setProcessingResult(null);
    
    try {
      toast({
        title: "Processing file",
        description: "Reading and validating Excel data...",
      });
      
      const result = await processExcelFile(file);
      setProcessingResult(result);
      
      if (result.validLeads.length > 0) {
        await upsertLeads.mutateAsync(result.validLeads);
        
        // Create import history record
        await createImportRecord.mutateAsync({
          fileName: file.name,
          totalRows: result.totalRows,
          validRows: result.validLeads.length,
          errorRows: result.errors.length,
          skippedRows: result.skippedRows,
          status: 'completed',
        });
        
        setFile(null);
        setProcessingResult(null);
      } else if (result.errors.length > 0) {
        // Create failed import record
        await createImportRecord.mutateAsync({
          fileName: file.name,
          totalRows: result.totalRows,
          validRows: 0,
          errorRows: result.errors.length,
          skippedRows: result.skippedRows,
          status: 'failed',
          errorMessage: result.errors.join(', '),
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing the file",
        variant: "destructive",
      });
      
      if (file) {
        await createImportRecord.mutateAsync({
          fileName: file.name,
          totalRows: 0,
          validRows: 0,
          errorRows: 1,
          skippedRows: 0,
          status: 'failed',
          errorMessage: String(error),
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <TabsContent value="file" className="space-y-4">
      <FileUploadSection
        file={file}
        setFile={setFile}
        onImport={handleImport}
        processing={processing}
      />
      
      <ProcessingResult processingResult={processingResult} />
    </TabsContent>
  );
}
