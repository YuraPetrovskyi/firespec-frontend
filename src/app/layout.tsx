import "./globals.css";
import type { Metadata } from "next";
import ToasterProvider from "@/components/ToasterProvider";

export const metadata: Metadata = {
  title: "FireSpec",
  description: "Fire Stopping Inspection Procedure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToasterProvider />
          {children}
      </body>
    </html>
  );
}
