import type { Metadata } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HostBoard MVP",
  description: "Multi-property management for short-term rental hosts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${josefin.variable} font-sans antialiased`}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
