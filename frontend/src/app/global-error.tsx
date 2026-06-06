"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "1rem", fontFamily: "system-ui, sans-serif" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Something went wrong!</h2>
          <p style={{ color: "#666" }}>A critical error occurred.</p>
          <button
            onClick={() => reset()}
            style={{ padding: "0.5rem 1.5rem", background: "#6366f1", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "1rem" }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
