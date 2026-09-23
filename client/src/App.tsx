import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { useStore } from "./store/useStore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCollections from "./pages/admin/AdminCollections";
import AdminCategories from "./pages/admin/AdminCategories";
import toast, { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import CollectionEdit from "./pages/CollectionEdit";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Landing from "./pages/Landing";
import Checklists from "./pages/Checklists";
import Swapping from "./pages/Swapping";
import CategoryDetail from "./pages/CategoryDetail";
import Chat from "./pages/Chat";
import Marketplace from "./pages/Marketplace";

const ProtectedRoute = ({ requireAdmin }: { requireAdmin?: boolean }) => {
  const user = useStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== "super_admin")
    return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Test from "./pages/Test";
import { AxiosError } from "axios";
import { useEffect } from "react";

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="tcg-theme">
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
          <Toaster position="top-right" />
          <Router>
            <Routes>
              <Route element={<DebugLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/test" element={<Test />} />

                <Route path="/checklists/*" element={<Checklists />} />
                <Route path="/s/:categoryId" element={<CategoryDetail />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/:id" element={<Marketplace />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
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
                <Route path="/admin" element={<ProtectedRoute requireAdmin />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="collections" element={<AdminCollections />} />
                  <Route path="categories" element={<AdminCategories />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </div>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
