
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export function EmailTab() {
  return (
    <TabsContent value="email">
      <div className="space-y-4">
        <p className="text-sm">Connect your email to import leads from your inbox.</p>
        <Button variant="outline" className="w-full">Connect Email</Button>
      </div>
    </TabsContent>
  );
}
