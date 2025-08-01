import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useBreviaStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  BarChart3,
  MessageSquare,
  FileText,
  Notebook,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Zap,
  Brain,
  Target,
  Database,
  GitBranch,
  BookOpen,
  Download,
  Sparkles
} from 'lucide-react';

export function Sidebar() {
  const [location] = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useBreviaStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navigationItems = [
    {
      id: 'clustering',
      label: 'Clustering Workbench',
      icon: BarChart3,
      path: '/clustering',
      description: 'Research clustering & analysis',
      color: 'text-emerald-400',
      badge: 'AI',
      isNew: true
    },
    {
      id: 'chat',
      label: 'Chat & Planner',
      icon: MessageSquare,
      path: '/chat',
      description: 'AI research assistant',
      color: 'text-blue-400',
      badge: 'GPT-4',
      comingSoon: true
    },
    {
      id: 'pdf',
      label: 'PDF Viewer',
      icon: FileText,
      path: '/pdf',
      description: 'Smart PDF analysis',
      color: 'text-purple-400',
      badge: 'PRO',
      comingSoon: true
    },
    {
      id: 'notebook',
      label: 'Research Notebook',
      icon: Notebook,
      path: '/notebook',
      description: 'Notes & insights',
      color: 'text-orange-400',
      badge: 'NEW',
      comingSoon: true
    }
  ];

  const recentProjects = [
    {
      id: '1',
      name: 'Retinal Degeneration Research',
      type: 'Medical Research',
      lastAccessed: '2m ago',
      papers: 47,
      status: 'active'
    },
    {
      id: '2',
      name: 'ML Model Performance',
      type: 'AI Research',
      lastAccessed: '1h ago',
      papers: 23,
      status: 'completed'
    },
    {
      id: '3',
      name: 'Clinical Trials Analysis',
      type: 'Healthcare',
      lastAccessed: '3h ago',
      papers: 89,
      status: 'in-progress'
    }
  ];

  if (sidebarCollapsed) {
    return (
      <div className="w-16 chatgpt-sidebar flex flex-col items-center py-4 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          onClick={() => setSidebarCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-10 h-10 p-0 relative rounded-lg ${
                  location === item.path
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.isNew && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 chatgpt-sidebar flex flex-col">
      {/* Header */}
      <div className="sidebar-header p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Brevia AI</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Research Platform</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setSidebarCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-gray-300 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500 focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        {/* Navigation */}
        <div className="space-y-1 mb-8">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-3">Workspace</h3>
          {navigationItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <div
                className={`group relative mx-2 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  location === item.path
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`h-5 w-5 ${location === item.path ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-0">
                          {item.badge}
                        </Badge>
                      )}
                      {item.isNew && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-0">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{item.description}</p>
                  </div>
                  {item.comingSoon && (
                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-transparent">
                      Soon
                    </Badge>
                  )}
                </div>
                
                {/* Active indicator */}
                {location === item.path && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gray-900 dark:bg-white rounded-r-full" />
                )}
              </div>
            </Link>
          ))}
        </div>

        <Separator className="bg-gray-200 dark:bg-gray-700 mb-6" />

        {/* Recent Projects */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recent Projects</h3>
            <Button variant="ghost" size="sm" className="w-7 h-7 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1 px-2">
            {recentProjects.map((project) => (
              <div key={project.id} className="chatgpt-project-card p-3 cursor-pointer group rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-gray-700 dark:group-hover:text-gray-200">
                      {project.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{project.type}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    project.status === 'active' ? 'bg-green-500' :
                    project.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Database className="h-3 w-3" />
                    <span>{project.papers} papers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{project.lastAccessed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-gray-700 mb-6" />

        {/* Quick Actions */}
        <div className="space-y-3 mb-8">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3">Quick Actions</h3>
          <div className="space-y-1 px-2">
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-0 rounded-lg px-3 py-2.5 transition-colors">
              <Target className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
              <span className="font-medium">Start New Research</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-0 rounded-lg px-3 py-2.5 transition-colors">
              <Download className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
              <span className="font-medium">Import Papers</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-0 rounded-lg px-3 py-2.5 transition-colors">
              <GitBranch className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
              <span className="font-medium">Export Analysis</span>
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-9 h-9">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold">U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-white">Researcher</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pro Plan</p>
          </div>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="chatgpt-stats-card p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium">API Usage</span>
            <span className="text-gray-900 dark:text-white font-semibold">73%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="bg-gray-900 dark:bg-white h-1.5 rounded-full transition-all duration-300" style={{ width: '73%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>2.1K requests</span>
            <span>27% remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;