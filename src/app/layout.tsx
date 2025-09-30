import "./globals.css";
import type { Metadata } from "next";
// import { AuthProvider } from "@/context/AuthContext";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import ToasterProvider from "@/components/ToasterProvider";

export const metadata: Metadata = {
  title: "FireSpec",
  description: "Fire Safety Inspection App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="mx-auto">
        <SessionProviderWrapper>
          <ToasterProvider />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
