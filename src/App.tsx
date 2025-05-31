import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/dashboard";
import Appointments from "./pages/appointments";
import Services from "./pages/services";
import Clients from "./pages/clients";
import Finance from "./pages/finance";
import Reports from "./pages/reports";
import Settings from "./pages/settings";
import Login from "./pages/Login";
import NotFound from "./pages/not-found";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MobileNav from "./components/layout/MobileNav";
import { useState } from "react";
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
          <Route path="/clients" component={Clients} />
          <Route path="/finance" component={Finance} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <MobileNav />
    </div>
  );
}

function App() {
  const { user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ilivehealth-admin-theme">
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
