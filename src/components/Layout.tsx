
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Import, 
  LogOut,
  Users,
  Menu,
  Trello
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Pipeline', path: '/pipeline', icon: <Trello className="h-5 w-5" /> },
    { name: 'Leads', path: '/leads', icon: <Users className="h-5 w-5" /> },
    { name: 'Import Data', path: '/import', icon: <Import className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-sidebar h-full transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-56"
        )}
      >
        <div className="flex items-center p-4 h-16">
          {!collapsed && (
            <h1 className="text-xl font-bold text-white">SP CRM Leads</h1>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            className="ml-auto text-sidebar-foreground"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md mx-2 transition-colors",
                    location.pathname === item.path && "bg-sidebar-accent text-white"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={cn(
              "flex items-center text-sidebar-foreground hover:bg-sidebar-accent w-full",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {!collapsed && <span>Log Out</span>}
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
