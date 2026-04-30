import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export function useTokenSync() {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === "loading") return;

    if (session?.accessToken) {
      sessionStorage.setItem("accessToken", session.accessToken);
    } else if (status === "unauthenticated") {
      sessionStorage.removeItem("accessToken");
    }
  }, [session?.accessToken, status]);

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      sessionStorage.removeItem("accessToken");
      signOut({ redirect: true, callbackUrl: "/sign-in" });
    }
  }, [session?.error]);

  return null;
}