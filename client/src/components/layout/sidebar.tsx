import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useBreviaStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import {
  ChevronLeft,
  ChevronRight,
  Search,
  Brain,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Plus,
  Folder,
  Hash,
  Zap,
  Eye,
  BookOpen,
  Users,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    id: 'search',
    label: 'Global Search',
    icon: Search,
    path: '/search',
  },
  {
    id: 'clustering',
    label: 'Clustering Workbench',
    icon: Brain,
    path: '/clustering',
    badge: 3,
  },
  {
    id: 'chat-planner',
    label: 'Chat & Planner',
    icon: MessageSquare,
    path: '/chat',
    badge: 2,
  },
  {
    id: 'pdf-viewer',
    label: 'PDF Analysis',
    icon: FileText,
    path: '/pdf',
  },
  {
    id: 'notebook',
    label: 'Research Notebook',
    icon: BookOpen,
    path: '/notebook',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
  },
];

const projectNavigation: NavItem[] = [
  {
    id: 'projects',
    label: 'Projects',
    icon: Folder,
    path: '/projects',
    children: [
      {
        id: 'project-1',
        label: 'AI Research Survey',
        icon: Hash,
        path: '/projects/1',
        badge: 5,
      },
      {
        id: 'project-2',
        label: 'LLM Benchmarking',
        icon: Hash,
        path: '/projects/2',
        badge: 12,
      },
      {
        id: 'project-3',
        label: 'Vision Transformers',
        icon: Hash,
        path: '/projects/3',
      },
    ],
  },
];

const toolNavigation: NavItem[] = [
  {
    id: 'ai-tools',
    label: 'AI Tools',
    icon: Zap,
    path: '/tools',
    children: [
      {
        id: 'summarizer',
        label: 'Text Summarizer',
        icon: FileText,
        path: '/tools/summarizer',
      },
      {
        id: 'analyzer',
        label: 'Document Analyzer',
        icon: Eye,
        path: '/tools/analyzer',
      },
      {
        id: 'translator',
        label: 'Translator',
        icon: Users,
        path: '/tools/translator',
      },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, workspaceMode, setWorkspaceMode } = useBreviaStore();
  const [expandedItems, setExpandedItems] = useState<string[]>(['projects']);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const isActiveItem = (path: string) => {
    return location === path || location.startsWith(path + '/');
  };

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isActiveItem(item.path);

    if (sidebarCollapsed && level === 0) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-12 h-12 p-0 relative",
                  isActive && "bg-brevia-primary text-primary-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs rounded-full bg-brevia-accent"
                    variant="secondary"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div className="space-y-1">
        <Link href={item.path}>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start h-9 px-3",
              level > 0 && "ml-4",
              isActive && "bg-brevia-primary text-primary-foreground"
            )}
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.id);
              }
            }}
          >
            <item.icon className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")} />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge 
                    className="ml-2 h-5 w-5 p-0 text-xs rounded-full bg-brevia-accent"
                    variant="secondary"
                  >
                    {item.badge}
                  </Badge>
                )}
                {hasChildren && (
                  <ChevronRight 
                    className={cn(
                      "h-4 w-4 transition-transform ml-2",
                      isExpanded && "rotate-90"
                    )} 
                  />
                )}
              </>
            )}
          </Button>
        </Link>

        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="ml-2 space-y-1">
            {item.children?.map((child) => (
              <NavItemComponent key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-brevia-secondary border-r border-brevia-default transition-all duration-300",
      sidebarCollapsed ? "w-16" : "w-[280px]"
    )}>
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-brevia-default">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold text-brevia-primary">Workspace</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {/* Quick Actions */}
            {!sidebarCollapsed && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-brevia-muted">Quick Actions</h3>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8">
                    <Plus className="h-3 w-3 mr-2" />
                    New Project
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8">
                    <FileText className="h-3 w-3 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-medium text-brevia-muted mb-3">Workbench</h3>
              )}
              <div className="space-y-1">
                {navigation.map((item) => (
                  <NavItemComponent key={item.id} item={item} />
                ))}
              </div>
            </div>

            <Separator className="bg-brevia-default" />

            {/* Projects */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-medium text-brevia-muted mb-3">Projects</h3>
              )}
              <div className="space-y-1">
                {projectNavigation.map((item) => (
                  <NavItemComponent key={item.id} item={item} />
                ))}
              </div>
            </div>

            <Separator className="bg-brevia-default" />

            {/* AI Tools */}
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-sm font-medium text-brevia-muted mb-3">AI Tools</h3>
              )}
              <div className="space-y-1">
                {toolNavigation.map((item) => (
                  <NavItemComponent key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="border-t border-brevia-default p-3">
          <div className="space-y-1">
            <NavItemComponent 
              item={{
                id: 'settings',
                label: 'Settings',
                icon: Settings,
                path: '/settings',
              }}
            />
            <NavItemComponent 
              item={{
                id: 'help',
                label: 'Help & Support',
                icon: HelpCircle,
                path: '/help',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;