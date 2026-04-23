export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
      <div className="relative">
        <div className="pemuat-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-lg">🏛️</div>
      </div>
      <p className="text-sm text-muted-foreground animate-[pulse-halus_1.6s_ease-in-out_infinite]">
        Memuat MAHESA...
      </p>
    </div>
  );
}
