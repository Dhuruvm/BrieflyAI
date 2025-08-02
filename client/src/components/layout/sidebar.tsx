import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useBreviaStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import brieflyLogo from "@assets/briefly-logo.png";
import {
  Search,
  BarChart3,
  MessageSquare,
  FileText,
  Notebook,
  Settings,
  ChevronLeft,
  Plus,
  Brain
} from 'lucide-react';

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useBreviaStore();

  const navigationItems = [
    {
      id: 'workspace',
      label: 'Bravia Assistant',
      icon: MessageSquare,
      path: '/workspace',
      description: 'AI research assistant'
    },
    {
      id: 'clustering',
      label: 'Cluster Analysis',
      icon: BarChart3,
      path: '/clustering',
      description: 'Data clustering & insights'
    },
    {
      id: 'pdf',
      label: 'Document Analyzer',
      icon: FileText,
      path: '/pdf',
      description: 'PDF analysis & extraction'
    },
    {
      id: 'notebook',
      label: 'Research Notes',
      icon: Notebook,
      path: '/notebook',
      description: 'Knowledge management'
    }
  ];

  const recentProjects = [
    {
      id: '1',
      name: 'Retinal Degeneration Research',
      lastAccessed: '2m ago',
    },
    {
      id: '2', 
      name: 'ML Model Performance',
      lastAccessed: '1h ago',
    },
    {
      id: '3',
      name: 'Clinical Trials Analysis', 
      lastAccessed: '3h ago',
    }
  ];

  if (sidebarCollapsed) {
    return null;
  }

  return (
    <div className="w-72 bg-background border-r border-border flex flex-col h-full transition-all duration-300">
      {/* Bravia Logo Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <img 
            src={brieflyLogo} 
            alt="Bravia AI" 
            className="h-8 w-auto"
          />
          <div>
            <h1 className="text-lg font-bold text-foreground">Bravia AI</h1>
            <p className="text-xs text-muted-foreground">Research Platform</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Button
            variant="ghost"
            size="sm" 
            className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted ml-auto"
            onClick={() => setSidebarCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          <Button
            className="w-full justify-start text-left h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setLocation('/workspace')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Research Session
          </Button>
        </div>

        <div className="px-4 pb-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link key={item.id} href={item.path}>
                <Button
                  variant="ghost"
                  className={`sidebar-item ${
                    location === item.path
                      ? 'active'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Chats */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Recent</h3>
          <div className="space-y-1">
            {recentProjects.slice(0, 5).map((project) => (
              <Button
                key={project.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => setLocation(`/note/${project.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {project.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {project.lastAccessed}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}