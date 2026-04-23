"use client";

import { useIsFetching } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function GlobalFetchingIndicator() {
  const isFetching = useIsFetching();
  const [show, setShow] = useState(false);

  // Debounce showing the indicator to avoid flickering on very fast requests
  useEffect(() => {
    if (isFetching > 0) {
      const timer = setTimeout(() => setShow(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isFetching]);

  if (!show) return null;

  return (
    <div 
      className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 animate-in fade-in zoom-in duration-300"
      title="Memperbarui data..."
    >
      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-wider">Sinkronisasi</span>
    </div>
  );
}
