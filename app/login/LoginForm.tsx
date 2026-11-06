"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "../components/Nav";
import Mosaic from "../components/Mosaic";
import { HR_USER } from "../lib/seed";
import { signIn, useDemo } from "../lib/store";
import Icon from "../shared/Icon";
import { Field, Flash, inputCls } from "../shared/ui";
import { T } from "../i18n/LangProvider";
import { tx } from "../i18n/translate";

export default function LoginForm() {
  const router = useRouter();
  const { workers } = useDemo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [workerId, setWorkerId] = useState("w1");

  const goHr = () => {
    signIn({ role: "hr" });
    router.push("/hr");
  };
  const goWorker = (id: string) => {
    signIn({ role: "worker", workerId: id });
    router.push("/worker");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const mail = email.trim().toLowerCase();
    if (!mail || !password) return setError("Enter your email and password.");
    if (mail === HR_USER.email) return goHr();
    const w = workers.find((x) => x.email.toLowerCase() === mail);
    if (w) return goWorker(w.id);
    setError("No account with this email. Use one of the demo shortcuts below.");
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <section className="noise relative flex min-h-[320px] flex-col justify-between p-6 text-white md:p-9">
        <Mosaic rows={4} cols={5} seed={11} />
        <div className="relative z-10 flex items-center justify-between">
          <Logo href="/" className="text-[26px]" />
          <Link href="/" className="flex items-center gap-2 text-[14px] text-white/70 transition hover:text-white">
            <Icon name="arrow" className="h-4 w-4 rotate-180" /> <T>Back to website</T>
          </Link>
        </div>
        <div className="relative z-10 py-16">
          <h1 className="h-display max-w-[9ch]">
            <T>Welcome</T> <span className="text-lime"><T>back.</T></span>
          </h1>
          <p className="mt-6 max-w-[26em] text-[17px] text-white/70">
            <T>One sign-in for everyone. HR manages workers, contracts and requests; workers request leave and see their own documents.</T>
          </p>
        </div>
      </section>

      <section className="flex flex-col justify-center bg-white p-6 text-ink md:p-12">
        <div className="mx-auto w-full max-w-[460px]">
          <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] tracking-[-0.03em]"><T>Sign in</T></h2>
          <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
            <Field label="Email"><input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder={tx("hr@demo.az")} autoComplete="username" className={inputCls} /></Field>
            <Field label="Password"><input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder={tx("Any password works in the demo")} autoComplete="current-password" className={inputCls} /></Field>
            {error && <Flash tone="bad">{error}</Flash>}
            <button type="submit" className="w-full bg-ink px-4 py-3.5 text-lime transition hover:bg-[#10300d]"><T>Sign in</T></button>
          </form>

          <div className="my-8 flex items-center gap-4 text-[13px] text-ink/45">
            <span className="h-px flex-1 bg-ink/15" /> <T>Demo shortcuts</T> <span className="h-px flex-1 bg-ink/15" />
          </div>

          <div className="space-y-3">
            <button type="button" onClick={goHr} className="flex w-full items-center justify-between border border-ink/25 px-4 py-4 text-left transition hover:border-ink hover:bg-mist">
              <span className="leading-tight">
                <span className="block text-[17px]"><T>HR login</T></span>
                <span className="mt-0.5 block text-[13px] text-ink/55"><T>{`${HR_USER.name} · manage workers and requests`}</T></span>
              </span>
              <Icon name="arrow" />
            </button>

            <div className="border border-ink/25 p-4">
              <div className="mb-3 leading-tight">
                <span className="block text-[17px]"><T>Worker login</T></span>
                <span className="mt-0.5 block text-[13px] text-ink/55"><T>Choose who to sign in as</T></span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select value={workerId} onChange={(e) => setWorkerId(e.target.value)} aria-label="Worker" className={`${inputCls} appearance-none pr-9`}>
                    {workers.map((w) => <option key={w.id} value={w.id}>{w.name} · {tx(w.position)}</option>)}
                  </select>
                  <Icon name="chevron" className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-ink/50" />
                </div>
                <button type="button" onClick={() => goWorker(workerId)} className="bg-ink px-5 text-lime transition hover:bg-[#10300d]"><T>Sign in</T></button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
