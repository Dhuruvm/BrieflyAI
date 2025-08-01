import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// Theme management utilities
export const initializeTheme = () => {
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  // Apply initial theme
  const storedTheme = localStorage.getItem('brevia-theme') as 'light' | 'dark' | 'system' | null;
  const theme = storedTheme || 'dark';
  applyTheme(theme);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    if (storedTheme === 'system') {
      applyTheme('system');
    }
  };

  mediaQuery.addEventListener('change', handleSystemThemeChange);

  return () => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  };
};

// Keyboard shortcuts
export const useKeyboardShortcuts = () => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Command/Ctrl + K for global search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      // Focus search input or open search modal
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Command/Ctrl + B for sidebar toggle
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      const store = useBreviaStore.getState();
      store.setSidebarCollapsed(!store.sidebarCollapsed);
    }

    // Escape to close modals/search
    if (e.key === 'Escape') {
      // Handle escape key functionality
    }
  };

  return { handleKeyDown };
};

// Store interface
interface BreviaStore {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // UI
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Workspace
  workspaceMode: 'clustering' | 'chat-planner' | 'pdf-viewer' | 'notebook';
  setWorkspaceMode: (mode: 'clustering' | 'chat-planner' | 'pdf-viewer' | 'notebook') => void;

  // Active IDs
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
  
  activeChatSessionId: string | null;
  setActiveChatSessionId: (id: string | null) => void;

  // Panel layout
  leftPanelWidth: number;
  rightPanelWidth: number;
  setLeftPanelWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;

  // Clustering configuration
  clusteringQuery: string;
  clusteringAlgorithm: 'kmeans' | 'hierarchical' | 'dbscan';
  clusteringResultCount: number;
  clusteringDataSource: string;
  clusteringVisualization: 'list' | 'treemap' | 'sunburst' | 'network';
  
  setClusteringQuery: (query: string) => void;
  setClusteringAlgorithm: (algorithm: 'kmeans' | 'hierarchical' | 'dbscan') => void;
  setClusteringResultCount: (count: number) => void;
  setClusteringDataSource: (source: string) => void;
  setClusteringVisualization: (viz: 'list' | 'treemap' | 'sunburst' | 'network') => void;

  // PDF Viewer
  pdfCurrentPage: number;
  pdfTotalPages: number;
  pdfZoom: number;
  pdfSidebarOpen: boolean;
  
  setPdfCurrentPage: (page: number) => void;
  setPdfTotalPages: (total: number) => void;
  setPdfZoom: (zoom: number) => void;
  setPdfSidebarOpen: (open: boolean) => void;

  // Search
  globalSearchQuery: string;
  globalSearchResults: any[];
  setGlobalSearchQuery: (query: string) => void;
  setGlobalSearchResults: (results: any[]) => void;

  // Keyboard shortcuts
  keyboardShortcutsEnabled: boolean;
  setKeyboardShortcutsEnabled: (enabled: boolean) => void;
}

export const useBreviaStore = create<BreviaStore>()(
  devtools(
    persist(
      (set: any, get: any) => ({
        // Theme
        theme: 'dark',
        setTheme: (theme: 'light' | 'dark' | 'system') => {
          set({ theme });
          // Apply theme to document
          const root = document.documentElement;
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.toggle('dark', systemTheme === 'dark');
          } else {
            root.classList.toggle('dark', theme === 'dark');
          }
        },
        
        // UI
        sidebarCollapsed: false,
        setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
        
        // Workspace
        workspaceMode: 'clustering',
        setWorkspaceMode: (mode: 'clustering' | 'chat-planner' | 'pdf-viewer' | 'notebook') => set({ workspaceMode: mode }),
        
        // Active IDs
        activeProjectId: null,
        setActiveProjectId: (id: string | null) => set({ activeProjectId: id }),
        
        activeDocumentId: null,
        setActiveDocumentId: (id: string | null) => set({ activeDocumentId: id }),
        
        activeChatSessionId: null,
        setActiveChatSessionId: (id: string | null) => set({ activeChatSessionId: id }),
        
        // Panel layout
        leftPanelWidth: 400,
        rightPanelWidth: 400,
        setLeftPanelWidth: (width: number) => set({ leftPanelWidth: width }),
        setRightPanelWidth: (width: number) => set({ rightPanelWidth: width }),

        // Clustering configuration
        clusteringQuery: '',
        clusteringAlgorithm: 'kmeans',
        clusteringResultCount: 50,
        clusteringDataSource: 'arxiv',
        clusteringVisualization: 'sunburst',
        
        setClusteringQuery: (query: string) => set({ clusteringQuery: query }),
        setClusteringAlgorithm: (algorithm: 'kmeans' | 'hierarchical' | 'dbscan') => set({ clusteringAlgorithm: algorithm }),
        setClusteringResultCount: (count: number) => set({ clusteringResultCount: count }),
        setClusteringDataSource: (source: string) => set({ clusteringDataSource: source }),
        setClusteringVisualization: (viz: 'list' | 'treemap' | 'sunburst' | 'network') => set({ clusteringVisualization: viz }),
        
        // PDF Viewer
        pdfCurrentPage: 1,
        pdfTotalPages: 1,
        pdfZoom: 100,
        pdfSidebarOpen: true,
        
        setPdfCurrentPage: (page: number) => set({ pdfCurrentPage: page }),
        setPdfTotalPages: (total: number) => set({ pdfTotalPages: total }),
        setPdfZoom: (zoom: number) => set({ pdfZoom: zoom }),
        setPdfSidebarOpen: (open: boolean) => set({ pdfSidebarOpen: open }),
        
        // Search
        globalSearchQuery: '',
        globalSearchResults: [],
        setGlobalSearchQuery: (query: string) => set({ globalSearchQuery: query }),
        setGlobalSearchResults: (results: any[]) => set({ globalSearchResults: results }),
        
        // Keyboard shortcuts
        keyboardShortcutsEnabled: true,
        setKeyboardShortcutsEnabled: (enabled: boolean) => set({ keyboardShortcutsEnabled: enabled }),
      }),
      {
        name: 'brevia-store',
        partialize: (state: BreviaStore) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          leftPanelWidth: state.leftPanelWidth,
          rightPanelWidth: state.rightPanelWidth,
          keyboardShortcutsEnabled: state.keyboardShortcutsEnabled,
        }),
      }
    ),
    { name: 'brevia-store' }
  )
);