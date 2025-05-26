import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { File, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { processExcelFile } from '@/utils/excelProcessor';
import { useUpsertLeads } from '@/hooks/useLeads';
import { toast } from '@/hooks/use-toast';

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

export function ImportForm() {
  const [fileType, setFileType] = useState("excel");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<any>(null);
  
  const upsertLeads = useUpsertLeads();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

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
              <div>
                <label className="text-sm font-medium mb-2 block">File Type</label>
                <Select defaultValue="excel" onValueChange={setFileType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx, .xls)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Upload File</label>
                <div 
                  className={`border-2 border-dashed rounded-md p-6 text-center ${dragActive ? 'border-primary' : 'border-border'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex flex-col items-center">
                      <File className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Drag & drop file here</p>
                        <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
                      </div>
                      <Input 
                        type="file" 
                        className="hidden" 
                        id="file-upload"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange} 
                      />
                      <label htmlFor="file-upload">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="cursor-pointer" 
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Browse Files
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {processingResult && (
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
              )}
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Expected columns:</strong> Dato, Firmanavn, Org.nr, Status, Kanal, Ansvarlig selger, Kontaktperson, Eksisterende kunde, kWp, PPA pris</p>
                <p><strong>Required:</strong> Firmanavn, Org.nr, Status</p>
                <p><strong>Duplicate handling:</strong> Leads with same Org.nr will be updated, empty fields will be filled</p>
              </div>
              
              <Button 
                className="w-full mt-4" 
                disabled={!file || processing}
                onClick={handleImport}
              >
                <Upload className="mr-2 h-4 w-4" />
                {processing ? 'Processing...' : 'Import File'}
              </Button>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
