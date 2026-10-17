"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApiClient,
  ApiRequestOptions,
  APIResponse,
  AuthSession,
  ExtendedUser,
  QueryInput,
} from "@tcg/api-contracts";
import { getQueryKey } from "@tcg/api-contracts";
import { createContext, useContext, useEffect } from "react";
import { queryKeys, withQueryKey } from "./query-keys";
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
  defaultQuery?: QueryInput;
  requestOptions?: ApiRequestOptions;
};
export const TcgSessionProvider = ({
  children,
  client,
  defaultQuery,
  requestOptions,
  onSessionChange,
}: TcgSessionProviderProps) => {
  const queryClient = useQueryClient();
  const sessionQueryKey = withQueryKey(
    queryKeys.me,
    getQueryKey(defaultQuery, requestOptions),
  );
  const session = useQuery({
    queryKey: sessionQueryKey,
    queryFn: () => bootstrapSession(client, requestOptions),
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
    queryClient.setQueryData(sessionQueryKey, authSession.user);
  }
  function clearSession() {
    queryClient.clear();
    queryClient.setQueryData(sessionQueryKey, null);
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
