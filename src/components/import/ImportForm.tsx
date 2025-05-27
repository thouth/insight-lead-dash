
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabNavigation } from './TabNavigation';
import { FileUploadTab } from './FileUploadTab';
import { ImportHistoryTable } from './ImportHistoryTable';

export function ImportForm() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Excel Data</CardTitle>
          <CardDescription>Upload Excel files to import lead data</CardDescription>
        </CardHeader>
        <CardContent>
          <TabNavigation>
            <FileUploadTab />
          </TabNavigation>
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
