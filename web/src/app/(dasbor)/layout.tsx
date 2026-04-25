import type { Metadata } from "next";
import { Header } from "@/components/tata-letak/header";
import { Sidebar } from "@/components/tata-letak/sidebar";

export const metadata: Metadata = {
  title: "Dasbor | MAHESA",
  description: "Manajemen Human-resource & Employee System",
};

export default function DasborLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
