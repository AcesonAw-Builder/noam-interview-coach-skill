import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jeju Travel Companion",
  description: "Your personal Korea trip assistant",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jeju Companion",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50 antialiased dark:bg-gray-950">{children}</body>
    </html>
  );
}
