
import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { FileUploadSection } from './FileUploadSection';
import { ProcessingResult } from './ProcessingResult';
import { processExcelFile } from '@/utils/excelProcessor';
import { useUpsertLeads } from '@/hooks/useLeads';
import { toast } from '@/hooks/use-toast';

export function FileUploadTab() {
  const [fileType, setFileType] = useState("excel");
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<any>(null);
  
  const upsertLeads = useUpsertLeads();

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
        setFile(null);
        setProcessingResult(null);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing the file",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <TabsContent value="file" className="space-y-4">
      <FileUploadSection
        fileType={fileType}
        setFileType={setFileType}
        file={file}
        setFile={setFile}
        onImport={handleImport}
        processing={processing}
      />
      
      <ProcessingResult processingResult={processingResult} />
    </TabsContent>
  );
}
