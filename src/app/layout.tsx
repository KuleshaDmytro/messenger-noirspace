import type { Metadata } from "next";

import Providers from "./providers/providers";

import "./globals.css";


export const metadata: Metadata = {
  title: "NoirSpace Messenger",
  description: "A modern messaging app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}
