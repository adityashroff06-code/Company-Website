import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, useSearch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionProvider } from "@/components/motion/Reveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import About from "@/pages/About";
import ManagementTeam from "@/pages/ManagementTeam";
import Quality from "@/pages/Quality";
import Contact from "@/pages/Contact";
import Industries from "@/pages/Industries";
import Applications from "@/pages/Applications";
import Technology from "@/pages/Technology";
import Downloads from "@/pages/Downloads";
import CaseStudies from "@/pages/CaseStudies";
import Career from "@/pages/Career";
import FAQ from "@/pages/FAQ";
import AdminLogin from "@/admin/AdminLogin";
import AdminDashboard from "@/admin/AdminDashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

/**
 * The visual check page for the design-system primitives (brief §8, Phase 2). The condition is
 * a build-time constant, so a production build carries neither the route nor the chunk;
 * `vite build --mode qa` keeps it for the screenshot run. The public route table is unchanged.
 */
const PrimitivesCheck =
  import.meta.env.MODE !== "production" ? lazy(() => import("@/dev/PrimitivesCheck")) : null;

/**
 * Every route change starts at the top, instantly. (The global `scroll-behavior: smooth` would
 * otherwise rewind through the tall pinned 3D stages, and Home had no reset of its own.)
 */
function ScrollToTop() {
  const [path] = useLocation();
  // The search string too: a product search mounts/unmounts the tall showroom on the same path.
  // The hash is left out on purpose so in-page anchors keep working.
  const search = useSearch();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [path, search]);
  return null;
}

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
      <Route path="/industries" component={() => <PublicLayout><Industries /></PublicLayout>} />
      <Route path="/applications" component={() => <PublicLayout><Applications /></PublicLayout>} />
      <Route path="/technology" component={() => <PublicLayout><Technology /></PublicLayout>} />
      <Route path="/downloads" component={() => <PublicLayout><Downloads /></PublicLayout>} />
      <Route path="/case-studies" component={() => <PublicLayout><CaseStudies /></PublicLayout>} />
      <Route path="/career" component={() => <PublicLayout><Career /></PublicLayout>} />
      <Route path="/faq" component={() => <PublicLayout><FAQ /></PublicLayout>} />
      <Route path="/about" component={() => <PublicLayout><About /></PublicLayout>} />
      <Route path="/management-team" component={() => <PublicLayout><ManagementTeam /></PublicLayout>} />
      <Route path="/quality" component={() => <PublicLayout><Quality /></PublicLayout>} />
      <Route path="/contact" component={() => <PublicLayout><Contact /></PublicLayout>} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      {PrimitivesCheck && (
        <Route
          path="/dev/primitives"
          component={() => (
            <PublicLayout>
              <Suspense fallback={null}>
                <PrimitivesCheck />
              </Suspense>
            </PublicLayout>
          )}
        />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Router />
          </WouterRouter>
          <Toaster />
        </MotionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
