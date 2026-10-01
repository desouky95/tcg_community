import { useSession } from "@tcg/react-query";
import useStore from "../store/useStore";
import { useEffect } from "react";
export function UserSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const { session } = useSession(!!user);

  

  useEffect(() => {
    if (session.isSuccess) {
      setUser(session.data.data);
    }
  }, [session.data?.data, session.isSuccess, setUser]);

  if (session.isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
