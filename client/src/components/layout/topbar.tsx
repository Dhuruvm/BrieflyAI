import { useState } from 'react';
import { useBreviaStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import {
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  Settings,
  LogOut,
  User,
  CreditCard,
  Key,
  Brain,
  FileText,
  MessageSquare,
  BookOpen,
  Zap,
} from 'lucide-react';

// Mock search results data
const searchResults = [
  {
    type: 'document',
    title: 'Attention Is All You Need',
    description: 'Transformer architecture paper',
    icon: FileText,
    path: '/documents/attention-paper',
  },
  {
    type: 'project',
    title: 'AI Research Survey',
    description: 'Current project with 12 documents',
    icon: Brain,
    path: '/projects/ai-survey',
  },
  {
    type: 'chat',
    title: 'Discussion about LLM benchmarks',
    description: 'Recent conversation',
    icon: MessageSquare,
    path: '/chat/llm-benchmarks',
  },
  {
    type: 'tool',
    title: 'Text Summarizer',
    description: 'AI-powered summarization tool',
    icon: Zap,
    path: '/tools/summarizer',
  },
];

export function Topbar() {
  const { theme, setTheme, globalSearchQuery, setGlobalSearchQuery } = useBreviaStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const filteredResults = searchResults.filter(result =>
    result.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    result.description.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-brevia-secondary border-b border-brevia-default">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brevia-primary to-brevia-secondary rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="logo-text text-xl font-bold">Brevia AI</h1>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            Research Platform
          </Badge>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brevia-muted" />
                <Input
                  placeholder="Search projects, documents, chats..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="pl-10 pr-4 h-10 bg-brevia-tertiary border-brevia-default focus:border-brevia-primary focus:ring-1 focus:ring-brevia-primary"
                />
                <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-brevia-muted bg-brevia-primary px-2 py-1 rounded">
                  ⌘K
                </kbd>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[600px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search everything..."
                  value={globalSearchQuery}
                  onValueChange={setGlobalSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  
                  {filteredResults.length > 0 && (
                    <>
                      <CommandGroup heading="Search Results">
                        {filteredResults.map((result, index) => (
                          <CommandItem
                            key={index}
                            onSelect={() => {
                              setSearchOpen(false);
                              // Handle navigation
                            }}
                            className="flex items-center space-x-3 p-3"
                          >
                            <div className="flex-shrink-0">
                              <result.icon className="h-4 w-4 text-brevia-muted" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-brevia-primary">
                                {result.title}
                              </div>
                              <div className="text-xs text-brevia-muted truncate">
                                {result.description}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      
                      <CommandSeparator />
                      
                      <CommandGroup heading="Quick Actions">
                        <CommandItem className="flex items-center space-x-3 p-3">
                          <Brain className="h-4 w-4 text-brevia-muted" />
                          <span>Start new clustering analysis</span>
                        </CommandItem>
                        <CommandItem className="flex items-center space-x-3 p-3">
                          <FileText className="h-4 w-4 text-brevia-muted" />
                          <span>Upload new document</span>
                        </CommandItem>
                        <CommandItem className="flex items-center space-x-3 p-3">
                          <BookOpen className="h-4 w-4 text-brevia-muted" />
                          <span>Create new project</span>
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* API Key Status */}
          <Button variant="ghost" size="sm" className="text-brevia-success">
            <Key className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">API Connected</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs rounded-full bg-brevia-accent"
                variant="secondary"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {theme === 'light' && <Sun className="h-4 w-4" />}
                {theme === 'dark' && <Moon className="h-4 w-4" />}
                {theme === 'system' && <Monitor className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                <Monitor className="h-4 w-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user.png" alt="User" />
                  <AvatarFallback className="bg-brevia-primary text-primary-foreground">
                    RA
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Research Assistant</p>
                  <p className="text-xs leading-none text-brevia-muted">
                    researcher@brevia.ai
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Topbar;