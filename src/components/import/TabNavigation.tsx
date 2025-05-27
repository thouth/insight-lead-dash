
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabNavigationProps {
  children: React.ReactNode;
}

export function TabNavigation({ children }: TabNavigationProps) {
  return (
    <Tabs defaultValue="file">
      <TabsList className="grid w-full grid-cols-1 mb-6">
        <TabsTrigger value="file">Excel Import</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
