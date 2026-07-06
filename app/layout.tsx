import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const display = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Grace Gao - Systems Engineer",
  description:
    "Grace Gao is a systems engineer in San Francisco building backend services, telemetry, and developer tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${mono.variable} ${display.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
