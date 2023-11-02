import ToastProvider from "@/provider/ToastProvider";
import "./globals.css";
import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import { ModalProvider } from "@/provider/ModalProvider";

const font = EB_Garamond({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple-Messaging-App",
  description:
    "An app that allows users chat rivately and in a group with ease",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ToastProvider />
        <ModalProvider />
        {children}
      </body>
    </html>
  );
}
