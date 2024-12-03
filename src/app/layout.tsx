import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import Providers from "./_components/providers";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "PO System - 165",
  description: "165 entertainment",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Providers>
            {children}
            <ToastContainer />
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
