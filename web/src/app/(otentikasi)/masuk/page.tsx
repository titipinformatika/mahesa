"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { loginAPI } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginAPI({ email, password });
      if (result.status === "success" && result.data) {
        saveAuth(result.data.token, result.data.peran);
        router.push("/dasbor");
      } else {
        setError(result.message || "Login gagal");
      }
    } catch (_err) {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-4 shadow-2xl border-white/10 bg-white/10 dark:bg-slate-900/50 backdrop-blur-2xl text-white animate-masuk-scale">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30 animate-masuk-scale">
          <span className="text-3xl">🏛️</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">MAHESA</CardTitle>
        <CardDescription className="text-slate-200/80">
          Manajemen Human-resource &amp; Employee System
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 stagger">
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/40 rounded-lg animate-masuk-fade">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-100">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
              <Input
                id="email"
                type="email"
                placeholder="admin@disdik.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-300 focus-visible:ring-blue-400/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-100">Kata Sandi</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-slate-300 focus-visible:ring-blue-400/60"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="size-4 mr-2 animate-spin" /> Memproses...</>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
