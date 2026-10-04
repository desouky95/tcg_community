import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { buildLoginUrl } from "@tcg/auth-client";
import { ThemeProvider } from "./components/ThemeProvider";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCollections from "./pages/admin/AdminCollections";
import AdminCategories from "./pages/admin/AdminCategories";
import toast, { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import CollectionEdit from "./pages/CollectionEdit";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Swapping from "./pages/Swapping";
import Chat from "./pages/Chat";

function RedirectToLogin() {
  const location = useLocation();

  useEffect(() => {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;

    window.location.assign(
      buildLoginUrl(import.meta.env.VITE_PUBLIC_WEB_URL, returnTo),
    );
  }, [location.hash, location.pathname, location.search]);

  return <p role="status">Redirecting to sign in…</p>;
}
const ProtectedRoute = ({ requireAdmin }: { requireAdmin?: boolean }) => {
  const { status, user } = useTcgSession();

  if (requireAdmin && user?.role === "user") {
    return <p>You are not authorized to view this page</p>;
  }
  if (status === "loading") {
    return <p role="status">Restoring your session…</p>;
  }

  if (status === "error") {
    return <p role="alert">We could not verify your session.</p>;
  }

  if (status === "anonymous") {
    return <RedirectToLogin />;
  }

  return <Outlet />;
};

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { ApiHooksProvider, SessionWrapper } from "./providers/ApiHooksProvider";
import Checklists from "./pages/Checklists";
import CategoryDetail from "./pages/CategoryDetail";
import Marketplace from "./pages/Marketplace";
import Collection from "./pages/Collection";
import { useTcgSession } from "@tcg/react-query";
import AdminLayout from "./components/AdminLayout";

const DebugLayout = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"

  useEffect(() => {
    console.log("The current URL is", { ...location });
    console.log("The last navigation action was", navigationType);
  }, [location, navigationType]);

  return <Outlet />;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError(error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : error.message;
      console.log(message);
      // toast.error()
    },
  }),
  mutationCache: new MutationCache({
    onError(error) {
      let message = "";
      if (!(error instanceof AxiosError)) {
        message = error.message;
      } else {
        message = error.response?.data.errors?.[0]?.message;
      }
      if (!message) return;

      console.log({ message });
      toast.error(message);
    },
  }),
});

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <SessionWrapper>
          <ApiHooksProvider>
            <ThemeProvider defaultTheme="system" storageKey="tcg-theme">
              <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
                <Toaster position="top-right" />
                <Routes>
                  <Route element={<DebugLayout />}>
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/checklists/*" element={<Checklists />} />
                      <Route
                        path="/s/:categoryId"
                        element={<CategoryDetail />}
                      />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route
                        path="/marketplace/:id"
                        element={<Marketplace />}
                      />
                      <Route path="/collection/:id" element={<Collection />} />

                      <Route
                        path="/collection/:id/edit"
                        element={<CollectionEdit />}
                      />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/edit" element={<ProfileEdit />} />
                      <Route path="/profile/:id" element={<Profile />} />
                      <Route path="/swapping" element={<Swapping />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/chat/:id" element={<Chat />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route
                      element={<ProtectedRoute requireAdmin />}
                    >
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route
                          path="collections"
                          element={<AdminCollections />}
                        />
                        <Route
                          path="categories"
                          element={<AdminCategories />}
                        />
                      </Route>
                    </Route>
                  </Route>
                </Routes>
              </div>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </ApiHooksProvider>
        </SessionWrapper>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
