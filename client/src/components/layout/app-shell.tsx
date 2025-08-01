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
    <div className="dark">
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-screen">
            <div className="flex-1">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppShell;