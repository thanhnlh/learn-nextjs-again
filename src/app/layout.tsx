import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Next.js - From Beginner to Advanced",
  description: "A comprehensive learning project for mastering Next.js, covering everything from basic concepts to advanced topics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
