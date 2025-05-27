
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { File, Upload } from 'lucide-react';

interface FileUploadSectionProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onImport: () => void;
  processing: boolean;
}

export function FileUploadSection({ 
  file, 
  setFile, 
  onImport, 
  processing 
}: FileUploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);

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

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Upload Excel File</label>
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
                <p className="text-sm font-medium">Drag & drop Excel file here</p>
                <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
              </div>
              <Input 
                type="file" 
                className="hidden" 
                id="file-upload"
                accept=".xlsx,.xls"
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

      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Expected columns:</strong> Dato, Firmanavn, Org.nr, Status, Kanal, Ansvarlig selger, Kontaktperson, Eksisterende kunde, kWp, PPA pris</p>
        <p><strong>Required:</strong> Firmanavn, Org.nr, Status</p>
        <p><strong>Empty rows:</strong> Rows without required fields will be skipped automatically</p>
        <p><strong>Duplicate handling:</strong> Existing leads (same Org.nr) will have empty fields updated with new data</p>
      </div>
      
      <Button 
        className="w-full mt-4" 
        disabled={!file || processing}
        onClick={onImport}
      >
        <Upload className="mr-2 h-4 w-4" />
        {processing ? 'Processing...' : 'Import Excel File'}
      </Button>
    </div>
  );
}
