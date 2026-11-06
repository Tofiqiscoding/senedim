"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { translate, type Lang } from "./translate";

/** Flip to true to bring back the AZ | EN switcher (the Azerbaijani dictionary in dict.ts is kept). */
export const LANG_ENABLED = false;

const KEY = "senedim-lang";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function getSnapshot(): Lang {
  try {
    return localStorage.getItem(KEY) === "en" ? "en" : "az";
  } catch {
    return "az";
  }
}
const getServerSnapshot = (): Lang => "az";

type Vars = Record<string, string | number>;
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (s: string, v?: Vars) => string }>({
  lang: "az",
  setLang: () => {},
  t: (s) => s,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const lang: Lang = LANG_ENABLED ? stored : "en";
  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(KEY, l);
    } catch {}
    listeners.forEach((f) => f());
  }, []);
  const t = useCallback((s: string, v?: Vars) => translate(s, lang, v), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
export const useT = () => useContext(Ctx).t;

/** Inline translated text, usable inside server components: <T>Open Demo</T> */
export function T({ children, vars }: { children: string; vars?: Vars }) {
  const t = useT();
  return <>{t(children, vars)}</>;
}

export function LangSwitch({ light = false }: { light?: boolean }) {
  const { lang, setLang } = useLang();
  if (!LANG_ENABLED) return null;
  return (
    <div role="group" aria-label="Language" className={`flex border ${light ? "border-ink/20" : "border-white/25"}`}>
      {(["az", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 text-[13px] uppercase transition ${
            lang === l ? (light ? "bg-ink text-lime" : "bg-lime text-ink") : light ? "text-ink/60 hover:bg-mist" : "text-white/70 hover:text-white"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
