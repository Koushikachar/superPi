"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { saveConsent } from "@/app/prefs-actions"; import { parseConsent, type Consent } from "@/lib/prefs";
type Ctx = { choice: Consent | null; asking: boolean; choose: (v: Consent) => void; reopen: () => void };
const C = createContext<Ctx>({ choice: null, asking: false, choose: () => {}, reopen: () => {} });
export const useConsent = () => useContext(C);
/** The pages are static, so the saved choice is read from the cookie in the browser right after load (the banner is only shown once we know there is no choice). Choosing saves the cookie on the server. */
export default function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<Consent | null>(null), [asking, setAsking] = useState(false), [, start] = useTransition();
  useEffect(() => { const c = parseConsent(document.cookie.match(/(?:^|; )d2h_consent=(granted|denied)/)?.[1]); setChoice(c); setAsking(c === null); }, []);
  const choose = useCallback((v: Consent) => { setChoice(v); setAsking(false); start(() => { void saveConsent(v); }); }, []);
  const reopen = useCallback(() => setAsking(true), []);
  return <C.Provider value={useMemo(() => ({ choice, asking, choose, reopen }), [choice, asking, choose, reopen])}>{children}</C.Provider>;
}
