import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "TapGo Rwanda - Transport Wallet & Card Management",
  description: "Manage your Tap & Go card, view balance, and top up with MTN MoMo or Airtel Money.",
  applicationName: "TapGo Rwanda",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TapGo Rwanda",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0B192C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <AppProvider>
            <AppShell>{children}</AppShell>
          </AppProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
