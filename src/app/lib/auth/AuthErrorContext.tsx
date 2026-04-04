"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type AuthErrorContextType = {
  error: string | null;
  setError: (message: string | null) => void;
};

const AuthErrorContext = createContext<AuthErrorContextType | undefined>(
  undefined
);

export function AuthErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthErrorContext.Provider value={{ error, setError }}>
      {children}
    </AuthErrorContext.Provider>
  );
}

export function useAuthError() {
  const ctx = useContext(AuthErrorContext);
  if (!ctx) {
    throw new Error("useAuthError must be used within AuthErrorProvider");
  }
  return ctx;
}
