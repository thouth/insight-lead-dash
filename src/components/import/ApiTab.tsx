
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export function ApiTab() {
  return (
    <TabsContent value="api">
      <div className="space-y-4">
        <p className="text-sm">Connect to external APIs to import leads automatically.</p>
        <Button variant="outline" className="w-full">Configure API</Button>
      </div>
    </TabsContent>
  );
}
