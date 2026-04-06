import React, { useState } from "react";
import { ArrowRight, Bot } from "lucide-react";
import { Badge } from "./ui/badge.tsx";
import { Button } from "./ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";

interface LoginPageProps {
  onLogin: (handle: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = (
  { onLogin, isLoading, error },
) => {
  const [handle, setHandle] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (handle.trim()) {
      onLogin(handle.trim());
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(93,211,255,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,177,92,0.14),transparent_24%),linear-gradient(180deg,#10181f_0%,#0a1015_100%)] p-4">
      <div className="pointer-events-none absolute -left-24 -top-20 h-96 w-96 rounded-full bg-sky-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-80 w-80 rounded-full bg-amber-300/15 blur-3xl" />

      <Card className="relative w-full max-w-2xl border-white/10 bg-slate-950/80 text-slate-50 shadow-2xl backdrop-blur">
        <CardHeader className="gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-sky-300/20 to-amber-300/20">
              <Bot size={26} />
            </div>
            <Badge
              variant="outline"
              className="border-sky-300/30 bg-sky-300/10 text-sky-100"
            >
              Copilotz Starter
            </Badge>
          </div>

          <div className="space-y-3">
            <CardTitle className="text-4xl tracking-tight sm:text-5xl">
              Domain-first Copilotz UI
            </CardTitle>
            <CardDescription className="max-w-xl text-base text-slate-300">
              Start a chat session against the new domain APIs and use the
              profile sidebar to edit durable user context without leaving the
              conversation.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-200">
                User ID
              </span>
              <Input
                type="text"
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                placeholder="jane.doe"
                disabled={isLoading}
                className="h-11 border-white/10 bg-black/20 text-slate-50 placeholder:text-slate-400"
              />
            </label>

            {error
              ? (
                <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              )
              : null}

            <Button
              className="h-11 w-full justify-center rounded-full bg-gradient-to-r from-sky-300 to-amber-300 font-semibold text-slate-950 hover:from-sky-200 hover:to-amber-200"
              type="submit"
              disabled={isLoading || handle.trim().length === 0}
            >
              <span>{isLoading ? "Opening session..." : "Enter chat"}</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div className="rounded-xl border border-white/8 bg-white/4 p-4">
              File resources via `createCopilotz`
            </div>
            <div className="rounded-xl border border-white/8 bg-white/4 p-4">
              Domain threads, messages, profile, graph
            </div>
            <div className="rounded-xl border border-white/8 bg-white/4 p-4">
              `@copilotz/chat-ui` + shadcn starter shell
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 text-sm text-slate-400">
          Use any external user ID. The starter persists thread history and
          profile data through Copilotz.
        </CardFooter>
      </Card>
    </main>
  );
};
