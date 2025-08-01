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
    <div className="w-80 modern-sidebar flex flex-col">
      {/* Header with gradient background */}
      <div className="sidebar-header p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-teal-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg relative">
                <Brain className="h-5 w-5 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">Brevia AI</h1>
                <p className="text-sm text-gray-400 font-medium">Research Platform</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              onClick={() => setSidebarCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Enhanced Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-black/30 backdrop-blur-sm border border-gray-600/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 text-sm"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-teal-600/0 group-focus-within:from-purple-600/5 group-focus-within:via-blue-600/5 group-focus-within:to-teal-600/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        {/* Navigation */}
        <div className="space-y-3 mb-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Workspace</h3>
          {navigationItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <div
                className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                  location === item.path
                    ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 border border-blue-400/30 shadow-lg shadow-blue-500/10'
                    : 'hover:bg-gradient-to-r hover:from-gray-800/50 hover:via-gray-700/50 hover:to-gray-800/50 hover:border hover:border-gray-600/30'
                }`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${location === item.path ? 'bg-blue-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'} transition-all duration-300`}>
                    <item.icon className={`h-5 w-5 ${location === item.path ? 'text-blue-400' : item.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-semibold text-sm ${location === item.path ? 'text-white' : 'text-gray-200'} group-hover:text-white transition-colors`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge variant="secondary" className={`text-xs px-2 py-0.5 font-medium ${location === item.path ? 'bg-blue-500/30 text-blue-200 border-blue-400/30' : 'bg-gray-700/50 text-gray-300 border-gray-600/30'}`}>
                          {item.badge}
                        </Badge>
                      )}
                      {item.isNew && (
                        <div className="flex items-center">
                          <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
                          <span className="text-xs bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded-full ml-1 font-medium">NEW</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors truncate">{item.description}</p>
                  </div>
                  {item.comingSoon && (
                    <Badge variant="outline" className="text-xs border-amber-600/50 text-amber-400 bg-amber-400/10 px-2 py-1 font-medium">
                      Soon
                    </Badge>
                  )}
                </div>
                
                {/* Active indicator */}
                {location === item.path && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full shadow-lg" />
                )}
                
                {/* Hover indicator */}
                {hoveredItem === item.id && location !== item.path && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-gray-400 rounded-r-full transition-all duration-300" />
                )}
              </div>
            </Link>
          ))}
        </div>

        <Separator className="bg-zinc-700/50 mb-6" />

        {/* Recent Projects */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Projects</h3>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id} className="modern-project-card p-4 cursor-pointer group transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-white truncate group-hover:text-blue-300 transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{project.type}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full mt-0.5 shadow-lg ${
                    project.status === 'active' ? 'bg-green-400 shadow-green-400/50 animate-pulse' :
                    project.status === 'completed' ? 'bg-blue-400 shadow-blue-400/50' : 'bg-amber-400 shadow-amber-400/50'
                  }`} />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                    <div className="flex items-center space-x-1">
                      <Database className="h-3 w-3" />
                      <span className="font-medium">{project.papers} papers</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 group-hover:text-gray-400 transition-colors">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{project.lastAccessed}</span>
                  </div>
                </div>

                {/* Progress bar for active projects */}
                {project.status === 'active' && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-green-400 to-blue-400 h-1.5 rounded-full w-3/4 transition-all duration-500"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-700/50 mb-6" />

        {/* Quick Actions */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 border-0 rounded-xl p-3 transition-all duration-300 group">
              <div className="p-1.5 bg-purple-500/20 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-all duration-300">
                <Target className="h-4 w-4 text-purple-400" />
              </div>
              <span className="font-medium">Start New Research</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-teal-600/20 border-0 rounded-xl p-3 transition-all duration-300 group">
              <div className="p-1.5 bg-blue-500/20 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-all duration-300">
                <Download className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-medium">Import Papers</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-green-600/20 border-0 rounded-xl p-3 transition-all duration-300 group">
              <div className="p-1.5 bg-teal-500/20 rounded-lg mr-3 group-hover:bg-teal-500/30 transition-all duration-300">
                <GitBranch className="h-4 w-4 text-teal-400" />
              </div>
              <span className="font-medium">Export Analysis</span>
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700/30 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-10 h-10 ring-2 ring-blue-400/30">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white">Researcher</p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-400">Pro Plan</p>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-green-400 font-medium">Active</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="modern-stats-card p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400 font-medium">API Usage</span>
              <span className="text-blue-400 font-bold">73%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 h-2 rounded-full transition-all duration-500 shadow-lg" style={{ width: '73%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>2.1K requests</span>
              <span>27% remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;