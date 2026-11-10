import type { Metadata } from "next";
import ToastArea from "@/components/ToastArea";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাজার দর | Bangladesh Daily Product Prices",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর, ক্যাটাগরি ও তুলনা এক জায়গায়।",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" data-scroll-behavior="smooth">
      <body>
        {children}
        <ToastArea />
      </body>
    </html>
  );
}
