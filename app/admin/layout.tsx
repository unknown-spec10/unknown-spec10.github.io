import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin — Deep Podder",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin">
      <header className="abar">
        <Link className="abar__brand" href="/admin">
          <span className="abar__mark">DP</span>
          <span className="abar__label">Admin</span>
        </Link>

        <nav className="abar__nav">
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/profile">Profile</Link>
          <Link href="/admin/capabilities">Capabilities</Link>
        </nav>

        <div className="abar__right">
          <span className="abar__note">Dev only · writes content/site.json</span>
          <Link className="abar__view" href="/" target="_blank" rel="noopener noreferrer">
            View site ↗
          </Link>
        </div>
      </header>

      <main className="amain">{children}</main>
    </div>
  );
}
