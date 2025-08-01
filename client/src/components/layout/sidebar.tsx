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
      <div className="w-16 delv-sidebar flex flex-col items-center py-4 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 text-zinc-400 hover:text-zinc-100"
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
                className={`w-10 h-10 p-0 relative ${
                  location === item.path
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.isNew && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
                )}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 delv-sidebar flex flex-col">
      {/* Header */}
      <div className="delv-header p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="delv-title text-lg">Brevia AI</h1>
              <p className="delv-caption">Research Platform</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-zinc-400 hover:text-zinc-100"
            onClick={() => setSidebarCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search projects, papers..."
            className="delv-input w-full pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        {/* Navigation */}
        <div className="space-y-2 mb-8">
          <h3 className="delv-caption mb-3 px-2">WORKSPACE</h3>
          {navigationItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <div
                className={`group relative p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  location === item.path
                    ? 'bg-emerald-500/20 border border-emerald-500/30 delv-glow'
                    : 'hover:bg-zinc-800/50 hover:border hover:border-zinc-700/50'
                }`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`h-5 w-5 ${location === item.path ? 'text-emerald-400' : item.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium text-sm ${location === item.path ? 'text-emerald-100' : 'text-zinc-200'}`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-zinc-700/50 text-zinc-300">
                          {item.badge}
                        </Badge>
                      )}
                      {item.isNew && (
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                      )}
                    </div>
                    <p className="delv-caption truncate">{item.description}</p>
                  </div>
                  {item.comingSoon && (
                    <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                      Soon
                    </Badge>
                  )}
                </div>
                
                {/* Hover indicator */}
                {hoveredItem === item.id && location !== item.path && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-r-full" />
                )}
              </div>
            </Link>
          ))}
        </div>

        <Separator className="bg-zinc-700/50 mb-6" />

        {/* Recent Projects */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="delv-caption">RECENT PROJECTS</h3>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-zinc-400 hover:text-zinc-100">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <div key={project.id} className="delv-card p-3 cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-zinc-200 truncate group-hover:text-emerald-300 transition-colors">
                      {project.name}
                    </h4>
                    <p className="delv-caption">{project.type}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    project.status === 'active' ? 'bg-emerald-400' :
                    project.status === 'completed' ? 'bg-blue-400' : 'bg-orange-400'
                  }`} />
                </div>
                
                <div className="flex items-center justify-between text-xs text-zinc-400">
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

        <Separator className="bg-zinc-700/50 mb-6" />

        {/* Quick Actions */}
        <div className="space-y-3 mb-8">
          <h3 className="delv-caption px-2">QUICK ACTIONS</h3>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start text-zinc-300 hover:text-zinc-100">
              <Target className="h-4 w-4 mr-3" />
              Start New Research
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-zinc-300 hover:text-zinc-100">
              <Download className="h-4 w-4 mr-3" />
              Import Papers
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-zinc-300 hover:text-zinc-100">
              <GitBranch className="h-4 w-4 mr-3" />
              Export Analysis
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-700/50">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="bg-emerald-600 text-white text-xs">U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-zinc-200">Researcher</p>
            <p className="delv-caption">Pro Plan</p>
          </div>
          <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-zinc-400 hover:text-zinc-100">
            <Settings className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="delv-stats-card p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">API Usage</span>
            <span className="text-emerald-400 font-medium">73%</span>
          </div>
          <div className="mt-1 w-full bg-zinc-700 rounded-full h-1">
            <div className="bg-emerald-400 h-1 rounded-full" style={{ width: '73%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;