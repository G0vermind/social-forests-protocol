import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Forest Protocol",
  description:
    "Tokenizando o reflorestamento real. Cultive mudas de Mogno Africano, forge Árvores Reais e participe da DAO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 flex">
        {/* Sidebar fica fora do scroll principal e é fixa no desktop */}
        <Sidebar />

        {/* Conteúdo principal — ocupa o resto da largura */}
        <div className="flex flex-1 flex-col min-w-0">
          {children}
        </div>
      </body>
    </html>
  );
}
