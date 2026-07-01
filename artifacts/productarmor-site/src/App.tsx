import { Switch, Route, Router as WouterRouter } from "wouter";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { Toaster } from "@/components/ui/toaster";
  import { TooltipProvider } from "@/components/ui/tooltip";
  import Navbar from "@/components/Navbar";
  import Footer from "@/components/Footer";
  import WhatsAppFloat from "@/components/WhatsAppFloat";
  import Home from "@/pages/Home";
  import Products from "@/pages/Products";
  import About from "@/pages/About";
  import Quality from "@/pages/Quality";
  import Contact from "@/pages/Contact";
  import AdminLogin from "@/admin/AdminLogin";
  import AdminDashboard from "@/admin/AdminDashboard";
  import NotFound from "@/pages/not-found";

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
  });

  function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </>
    );
  }

  function Router() {
    return (
      <Switch>
        <Route path="/" component={() => <PublicLayout><Home /></PublicLayout>} />
        <Route path="/products" component={() => <PublicLayout><Products /></PublicLayout>} />
        <Route path="/about" component={() => <PublicLayout><About /></PublicLayout>} />
        <Route path="/quality" component={() => <PublicLayout><Quality /></PublicLayout>} />
        <Route path="/contact" component={() => <PublicLayout><Contact /></PublicLayout>} />
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  export default function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
  