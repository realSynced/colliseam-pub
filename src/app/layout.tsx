import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Inter } from "next/font/google";

import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

import "./globals.css";

export const metadata: Metadata = {
  title: "Colliseam",
  description:
    "Colliseam - A place where developers and designers unite. Create projects, collaborate with others, and find inspiration for your next big idea. Use groundbreaking tools to bring your ideas to life. Seamless collaboration made simple. Don't miss out! Join the future of collaboration now.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <main className={`no-scrollbar bg-bodybg`}>
          <NextUIProvider>{children}</NextUIProvider>
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
