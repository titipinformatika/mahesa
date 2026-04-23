import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TemaToggle } from "@/components/tema-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAHESA — Manajemen SDM",
  description: "Manajemen Human-resource & Employee System",
};

const temaInitScript = `
(function() {
  try {
    var t = localStorage.getItem('tema');
    var sistem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'gelap' || (!t && sistem)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
        <TemaToggle />
      </body>
    </html>
  );
}
