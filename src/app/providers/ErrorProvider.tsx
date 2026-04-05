import { ApolloError } from "@apollo/client";
import { createContext, useContext, useState, ReactNode } from "react";

type ErrorContextType = {
  msg: string;
  error: ApolloError | undefined;
  showError: (
    error: ApolloError | undefined, 
    msg: string
  ) => void;
  clearError: () => void;
};

const ErrorContext = createContext<ErrorContextType | null>(null);

const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<ApolloError | undefined>(undefined);
  const [msg, setMsg] = useState<string>("");

  const showError = (error: ApolloError | undefined, msg: string) => {
    setError(error);
    setMsg(msg);
  };

  const clearError = () => {
    setError(undefined);
    setMsg("");
  };

  return (
    <ErrorContext.Provider value={{ msg, error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;

export const useErrorContext = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error("useError must be used within ErrorProvider");
  return ctx;
};