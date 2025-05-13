import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import ClinicDetail from "./pages/ClinicDetail";
import ProfessionalDetail from "./pages/ProfessionalDetail";
import AppointmentScheduling from "./pages/AppointmentScheduling";
import AppointmentSuccess from "./pages/AppointmentSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import BottomNavigation from "./components/BottomNavigation";
import { useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext";

function Router() {
  const [location] = useLocation();
  const { setShowBackButton } = useContext(AppContext);

  useEffect(() => {
    // Show back button on all routes except home
    setShowBackButton(location !== "/");
  }, [location, setShowBackButton]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/clinic/:id" component={ClinicDetail} />
      <Route path="/professional/:id" component={ProfessionalDetail} />
      <Route path="/appointment" component={AppointmentScheduling} />
      <Route path="/appointment/success" component={AppointmentSuccess} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 pb-16">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <BottomNavigation />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
