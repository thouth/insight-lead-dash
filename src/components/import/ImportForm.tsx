
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileUploadSection } from './FileUploadSection';
import { ProcessingResult } from './ProcessingResult';
import { ImportHistoryTable } from './ImportHistoryTable';
import { processExcelFile } from '@/utils/excelProcessor';
import { useUpsertLeads } from '@/hooks/useLeads';
import { toast } from '@/hooks/use-toast';

export function ImportForm() {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
          <CardDescription>Choose a source to import lead data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="file">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="file">File</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
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
            
            <TabsContent value="email">
              <div className="space-y-4">
                <p className="text-sm">Connect your email to import leads from your inbox.</p>
                <Button variant="outline" className="w-full">Connect Email</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="api">
              <div className="space-y-4">
                <p className="text-sm">Connect to external APIs to import leads automatically.</p>
                <Button variant="outline" className="w-full">Configure API</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>Recent data imports and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ImportHistoryTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
