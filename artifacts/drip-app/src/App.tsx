import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Scan from "@/pages/scan";
import Result from "@/pages/result";
import History from "@/pages/history";
import StyleDNA from "@/pages/style-dna";
import Profile from "@/pages/profile";
import { useAuth } from "@/hooks/use-auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  }
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-display text-2xl italic text-foreground animate-pulse">DRIP.</p>
      </div>
    );
  }

  if (!user) {
    setLocation("/landing");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/landing" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />

        <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/scan" component={() => <ProtectedRoute component={Scan} />} />
        <Route path="/result/:id" component={() => <ProtectedRoute component={Result} />} />
        <Route path="/history" component={() => <ProtectedRoute component={History} />} />
        <Route path="/dna" component={() => <ProtectedRoute component={StyleDNA} />} />
        <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />

        <Route component={() => (
          <div className="min-h-screen flex items-center justify-center bg-background flex-col">
            <h1 className="font-display text-6xl text-foreground mb-4">404</h1>
            <p className="font-display uppercase tracking-widest text-muted-foreground">Page Not Found</p>
          </div>
        )} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
