import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Noticias from "@/pages/Noticias";
import Pastorais from "@/pages/Pastorais";
import Missas from "@/pages/Missas";
import Capelas from "@/pages/Capelas";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminNoticias from "@/pages/AdminNoticias";
import AdminPastorais from "@/pages/AdminPastorais";
import AdminMissas from "@/pages/AdminMissas";
import AdminCapelas from "@/pages/AdminCapelas";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/noticias" component={Noticias} />
      <Route path="/pastorais" component={Pastorais} />
      <Route path="/missas" component={Missas} />
      <Route path="/capelas" component={Capelas} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/noticias" component={AdminNoticias} />
      <Route path="/admin/pastorais" component={AdminPastorais} />
      <Route path="/admin/missas" component={AdminMissas} />
      <Route path="/admin/capelas" component={AdminCapelas} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
