import "./globals.css";
import type { Metadata } from "next";

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
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
