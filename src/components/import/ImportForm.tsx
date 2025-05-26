
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabNavigation } from './TabNavigation';
import { FileUploadTab } from './FileUploadTab';
import { EmailTab } from './EmailTab';
import { ApiTab } from './ApiTab';
import { ImportHistoryTable } from './ImportHistoryTable';

export function ImportForm() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
          <CardDescription>Choose a source to import lead data</CardDescription>
        </CardHeader>
        <CardContent>
          <TabNavigation>
            <FileUploadTab />
            <EmailTab />
            <ApiTab />
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
