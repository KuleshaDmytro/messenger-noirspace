"use client"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import { ApolloProvider } from "@apollo/client";
import client from "@/app/lib/apolloClient";
import { ThemeProvider } from "@mui/material";
import theme from "../styles/theme";
import ErrorProvider from "./ErrorProvider";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <ErrorProvider>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </ErrorProvider>
      </ApolloProvider>
    </SessionProvider>
  )
}