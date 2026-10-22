import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <h1 className="page-title">Check not found</h1>
      <p className="sub">It may have been deleted. <Link href="/history">Back to history</Link></p>
    </main>
  );
}
