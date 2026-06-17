"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#0a1628",
          color: "#e8edf4",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ fontSize: 64, fontWeight: 700, color: "#f4b942", margin: 0 }}>!</p>
          <h1 style={{ marginTop: 8, fontSize: 28 }}>The site went down hard.</h1>
          <p style={{ marginTop: 8, color: "rgba(232,237,244,0.7)" }}>
            A fatal error stopped the app from rendering.
          </p>
          {error.digest && (
            <p style={{ marginTop: 4, fontSize: 12, color: "rgba(232,237,244,0.5)" }}>
              Reference: <code>{error.digest}</code>
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 20px",
              background: "#f4b942",
              color: "#0a1628",
              fontWeight: 700,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
