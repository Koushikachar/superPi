"use client";
// Last-resort screen when even the root layout fails. A full reload (not reset) also recovers from a stale deploy.
export default function GlobalError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body style={{ fontFamily: "system-ui", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0, background: "#F8F8FD", color: "#14162F" }}>
    <div style={{ maxWidth: 380, textAlign: "center", padding: 24 }}><h1>Something went wrong</h1><p>Reloading usually fixes it.{error.digest ? ` Reference: ${error.digest}` : ""}</p>
      <button onClick={() => location.reload()} style={{ padding: "10px 18px", borderRadius: 12, border: 0, background: "#4335CF", color: "#fff", fontSize: 16 }}>Reload page</button></div></body></html>;
}
