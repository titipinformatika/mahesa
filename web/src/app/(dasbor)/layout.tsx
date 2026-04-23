import { Header } from "@/components/tata-letak/header";
import { Sidebar } from "@/components/tata-letak/sidebar";

export default function DasborLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="animate-masuk-fade">{children}</div>
        </main>
      </div>
    </div>
  );
}
