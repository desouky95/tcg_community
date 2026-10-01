"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApiClient,
  APIResponse,
  AuthResponse,
  AuthSession,
  ExtendedUser,
  User,
} from "@tcg/api-contracts";
import { createContext, useContext, useEffect } from "react";
import { queryKeys } from "./query-keys";
import { bootstrapSession } from "@tcg/auth-client";

type SessionStatus = "loading" | "authenticated" | "anonymous" | "error";

type SessionContextValue = {
  user: ExtendedUser | null;
  status: SessionStatus;
  refresh: () => Promise<unknown>;
  establish: (authSession: AuthSession) => void;
  clearSession: () => void;
  client: ApiClient;
};

const SessionContext = createContext<SessionContextValue | null>(null);

type TcgSessionProviderProps = {
  onLogout?: () => void;
  onSessionChange?: (session: APIResponse<ExtendedUser>) => void;
  children: React.ReactNode;
  client: ApiClient;
};
export const TcgSessionProvider = ({
  children,
  client,
  onSessionChange,
}: TcgSessionProviderProps) => {
  const queryClient = useQueryClient();
  const session = useQuery({
    queryKey: queryKeys.me,
    queryFn: () => bootstrapSession(client),
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (session.isSuccess && session.data) {
      onSessionChange?.(session.data.data);
    }
  }, [session.isFetching]);

  const user = session.data?.data.data ?? null;

  const status: SessionStatus = session.isPending
    ? "loading"
    : session.isError
      ? "error"
      : user
        ? "authenticated"
        : "anonymous";

  function establish(authSession: AuthSession) {
    queryClient.setQueryData(queryKeys.me, authSession.user);
  }
  function clearSession() {
    queryClient.clear();
    queryClient.setQueryData(queryKeys.me, null);
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        status,
        refresh: session.refetch,
        establish,
        clearSession,
        client,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useTcgSession() {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error("useTcgSession must be used within TcgApiSessionProvider");
  }

  return session;
}
