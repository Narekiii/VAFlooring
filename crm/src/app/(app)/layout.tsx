import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbarIn">
          <Link href="/" className="wordmark">
            V &amp; A Flooring <span>Prospecting</span>
          </Link>
          <form action={signOut}>
            <button className="signout">Sign out</button>
          </form>
        </div>
      </header>
      <main id="main" className="wrap">
        {children}
      </main>
    </>
  );
}
