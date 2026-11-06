"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "../lib/store";
import { useT } from "../i18n/LangProvider";

export default function DemoPicker({ id }: { id?: string }) {
  const t = useT();
  const router = useRouter();
  const [role, setRole] = useState("");
  const go = () => {
    // shortcut: pick a role and jump straight into that demo; otherwise go to the login page
    if (role === "hr") {
      signIn({ role: "hr" });
      router.push("/hr");
    } else if (role === "worker") {
      signIn({ role: "worker", workerId: "w1" });
      router.push("/worker");
    } else router.push("/login");
  };
  return (
    <div id={id} className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
      <label className="relative block w-full sm:w-[307px]">
        <span className="sr-only">{t("Choose a role")}</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-[60px] w-full appearance-none rounded-none bg-white px-6 text-lg text-ink/60 outline-none"
        >
          <option value="" disabled>
            {t("Choose a role")}
          </option>
          <option value="hr">HR</option>
          <option value="worker">{t("Worker")}</option>
        </select>
        <span aria-hidden className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-ink/50">
          ▾
        </span>
      </label>
      <button
        type="button"
        onClick={go}
        className="border-b-[3px] border-current text-[clamp(2rem,3.9vw,4rem)] leading-[1.05] tracking-[-0.03em] transition hover:text-lime"
      >
        {t("Go to demo")}
      </button>
    </div>
  );
}
