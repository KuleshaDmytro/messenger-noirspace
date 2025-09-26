"use client"
import { SessionProvider } from "next-auth/react"

import { ApolloProvider } from "@apollo/client";
import client from "@/app/lib/apolloClient";

import { ThemeProvider } from "@mui/material";
import theme from "../styles/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
        <SessionProvider>
          <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
              {children}
            </ThemeProvider>
          </ApolloProvider>
        </SessionProvider>
  )
}