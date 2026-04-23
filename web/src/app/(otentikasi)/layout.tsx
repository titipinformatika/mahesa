export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-aurora overflow-hidden p-4">
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-blue-500/30 blur-3xl animate-[pulse-halus_6s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-indigo-500/30 blur-3xl animate-[pulse-halus_8s_ease-in-out_infinite]" />
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
