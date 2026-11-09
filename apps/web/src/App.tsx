import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { buildLoginUrl } from "@tcg/auth-client";
import { ThemeProvider } from "./components/ThemeProvider";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCollections from "./pages/admin/AdminCollections/AdminCollections";
import AdminCategories from "./pages/admin/AdminCategories/AdminCategories";
import AdminCategoryFormPage from "./pages/admin/AdminCategories/AdminCategoryFormPage";
import toast, { Toaster } from "react-hot-toast";
import { Dashboard } from "./pages/Dashboard";
import CollectionEdit from "./pages/CollectionEdit";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Recovery from "./pages/Recovery";
import AccountSettings from "./pages/AccountSettings";
import DeleteDeactivated from "./pages/DeleteDeactivated";
import SharedCollection from "./pages/SharedCollection";
import Swapping from "./pages/Swapping";
import Chat from "./pages/Chat";

function RedirectToLogin() {
  const location = useLocation();

  useEffect(() => {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;

    window.location.assign(
      buildLoginUrl(import.meta.env.VITE_PUBLIC_WEB_URL, returnTo)
    );
  }, [location.hash, location.pathname, location.search]);

  return <p role="status">Redirecting to sign in…</p>;
}
function RedirectPublicAuth({ page }: { page: "login" | "signup" | "verify-otp" | "login/otp" }) {
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("destination", "collector");
    if (!params.has("returnTo")) params.set("returnTo", "/dashboard");
    if (page === "verify-otp" && typeof location.state?.mobile === "string") params.set("mobile", location.state.mobile);
    const url = new URL(`/${page}`, import.meta.env.VITE_PUBLIC_WEB_URL);
    url.search = params.toString();
    window.location.replace(url.toString());
  }, [location.search, location.state, page]);
  return <p role="status">Redirecting to authentication…</p>;
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
import { Collection } from "./pages/Collection";
import { useTcgSession } from "@tcg/react-query";
import AdminLayout from "./components/AdminLayout";
import { AdminScrapper } from "./pages/admin/AdminScrapper/AdminScrapper";
import { CollectionAddForm } from "./components/molecules/CollectionAddForm/CollectionAddForm";
import { CollectionEditForm } from "./components/molecules/CollectionEditForm/CollectionEditForm";
import Test from "./pages/Test";

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

function RetiredMarketplace() {
  return (
    <section className="mx-auto max-w-2xl py-24 text-center">
      <p className="ui-kicker">RETIRED</p>
      <h1 className="mt-3 text-4xl font-display">
        Marketplace listings are no longer available.
      </h1>
      <p className="mt-4 text-muted-foreground">
        Next Pull is focused on checklists now. Official products live in the
        public store.
      </p>
    </section>
  );
}

function App() {
  const location = useLocation();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionWrapper>
          <ApiHooksProvider>
            <ThemeProvider defaultTheme="system" storageKey="tcg-theme">
              <div className="min-h-screen bg-background text-foreground transition-colors duration-200 h-px">
                <Toaster position="top-right" />

                <Routes location={location} key={location.key}>
                  <Route path="/shared/collection/:token" element={<SharedCollection />} />
                  <Route path="/collectors/:userId/collections/:checklistId" element={<SharedCollection />} />
                  <Route path="/login" element={<RedirectPublicAuth page="login" />} />
                  <Route path="/signup" element={<RedirectPublicAuth page="signup" />} />
                  <Route path="/verify-otp" element={<RedirectPublicAuth page="verify-otp" />} />
                  <Route path="/login/otp" element={<RedirectPublicAuth page="login/otp" />} />
                  <Route path="/delete-deactivated" element={<DeleteDeactivated />} />
                  <Route path="/forgot-password" element={<Recovery />} />
                  <Route element={<Outlet />}>
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/test" element={<Test />} />
                      <Route path="/checklists/*" element={<Checklists />} />
                      <Route
                        path="/s/:categoryId"
                        element={<CategoryDetail />}
                      />
                      <Route
                        path="/marketplace/*"
                        element={<RetiredMarketplace />}
                      />
                      <Route path="/collection/:id" element={<Collection />} />

                      <Route
                        path="/collection/:id/edit"
                        element={<CollectionEdit />}
                      />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/edit" element={<ProfileEdit />} />
                      <Route path="/settings" element={<AccountSettings />} />
                      <Route path="/profile/:id" element={<Profile />} />
                      <Route path="/swapping" element={<Swapping />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/chat/:id" element={<Chat />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute requireAdmin />}>
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route
                          path="collections"
                          element={<AdminCollections />}
                        />
                        <Route
                          path="collections/new"
                          element={<CollectionAddForm />}
                        />
                        <Route
                          path="collections/:id/edit"
                          element={<CollectionEditForm />}
                        />
                        <Route
                          path="categories"
                          element={<AdminCategories />}
                        />
                        <Route
                          path="categories/new"
                          element={<AdminCategoryFormPage />}
                        />
                        <Route
                          path="categories/:id/edit"
                          element={<AdminCategoryFormPage />}
                        />
                        <Route path="scrapper" element={<AdminScrapper />} />
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
    </>
  );
}

export default App;
