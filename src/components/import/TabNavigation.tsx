
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabNavigationProps {
  children: React.ReactNode;
}

export function TabNavigation({ children }: TabNavigationProps) {
  return (
    <Tabs defaultValue="file">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="file">File</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
