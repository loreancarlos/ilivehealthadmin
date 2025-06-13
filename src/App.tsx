import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";

import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Services from "./pages/Services";
import Partners from "./pages/Partners";
import Clients from "./pages/Clients";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/authStore";

function AppContent() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't render layout for login page
  if (location === "/") {
    return (
      <Switch>
        <Route path="/" component={Login} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background font-sans antialiased">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 lg:ml-64">
        <Header setSidebarOpen={setSidebarOpen} />

        <Switch>
          <Route path="/" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/appointments" component={Appointments} />
          <Route path="/services" component={Services} />
          <Route path="/partners" component={Partners} />
          <Route path="/clients" component={Clients} />
          <Route path="/finance" component={Finance} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={Settings} />
          <Route
            path="*"
            component={() => {
              const [, setLocation] = useLocation(); // hook válido aqui
              const { clinic, professional } = useAuthStore();

              useEffect(() => {
                if (!!clinic || !!professional) setLocation("/dashboard");
                else setLocation("/");
              }, [clinic, professional, setLocation]);

              return null;
            }}
          />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ilivehealth-admin-theme">
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
