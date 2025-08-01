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
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-0" : "ml-0" // Ensure proper spacing
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;