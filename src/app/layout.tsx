import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar/navbar";
import QueryProvider from "@/lib/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { APP_NAME } from "@/lib/constants/app-type";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} - List Your Turf & Take Bookings`,
  description:
    "Publish your sports turf, manage bookings, and grow your venue business. Built for turf owners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${outfit.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
