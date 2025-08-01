import { useEffect } from 'react';
import { useBreviaStore, initializeTheme, useKeyboardShortcuts } from '@/lib/store';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed, theme } = useBreviaStore();
  const { handleKeyDown } = useKeyboardShortcuts();

  useEffect(() => {
    // Initialize theme handling
    const cleanup = initializeTheme();
    
    // Add keyboard shortcut listener
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      cleanup();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Remove handleKeyDown dependency to prevent infinite loop

  return (
    <div className={cn(
      "min-h-screen bg-brevia-primary text-brevia-primary transition-colors duration-300",
      theme === 'light' && "light"
    )}>
      {/* Top Navigation */}
      <Topbar />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "ml-16" : "ml-[280px]"
          )}
        >
          <div className="h-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;