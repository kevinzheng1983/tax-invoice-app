"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="app-shell"><section className="empty-state error-state"><h1>Something went wrong</h1><p>We could not reach the database. Check your connection and try again.</p><button className="primary-button" onClick={reset}>Try again</button></section></main>;
}
