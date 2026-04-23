"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function TemaToggle() {
  const [gelap, setGelap] = useState(false);
  const [dimuat, setDimuat] = useState(false);

  useEffect(() => {
    setDimuat(true);
    setGelap(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const akanGelap = !gelap;
    document.documentElement.classList.toggle("dark", akanGelap);
    try {
      localStorage.setItem("tema", akanGelap ? "gelap" : "terang");
    } catch {}
    setGelap(akanGelap);
  };

  if (!dimuat) return null;

  return (
    <button
      type="button"
      aria-label="Ubah tema"
      onClick={toggle}
      className="fixed bottom-5 right-5 z-50 size-11 rounded-full border border-border bg-card/80 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center text-foreground"
    >
      <Sun className={`size-5 absolute transition-all duration-500 ${gelap ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`} />
      <Moon className={`size-5 absolute transition-all duration-500 ${gelap ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`} />
    </button>
  );
}
