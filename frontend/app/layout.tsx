import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

import Navigation from "@/components/Navigation";
import { ApolloWrapper } from "@/contexts/ApolloWrapper";
import { UserProvider } from "@/contexts/UserProvider";
import { CartProvider } from "@/contexts/CartProvider";

const Cart = dynamic(() => import("@/components/Cart"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <CartProvider>
            <Navigation />
            <Cart />
            <ApolloWrapper>{children}</ApolloWrapper>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
