import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/layout/app-shell";
import Landing from "@/pages/landing";
import Workspace from "@/pages/workspace";
import ClusteringPage from "@/pages/clustering";
import NotFound from "@/pages/not-found";
import LoadingPage from "@/components/loading-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/clustering">
        <AppShell>
          <ClusteringPage />
        </AppShell>
      </Route>
      <Route path="/workspace">
        <AppShell>
          <Workspace />
        </AppShell>
      </Route>
      <Route path="/note/:id">
        <AppShell>
          <Workspace />
        </AppShell>
      </Route>
      <Route path="/chat">
        <AppShell>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat & Planner Coming Soon</h1>
          </div>
        </AppShell>
      </Route>
      <Route path="/pdf">
        <AppShell>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PDF Viewer Coming Soon</h1>
          </div>
        </AppShell>
      </Route>
      <Route path="/notebook">
        <AppShell>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Research Notebook Coming Soon</h1>
          </div>
        </AppShell>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading page for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
