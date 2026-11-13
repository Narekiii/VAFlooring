import Link from "next/link";
import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/auth";
import { logout } from "../actions-auth";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="shell">
      <a href="#main" className="skip">
        Skip to content
      </a>
      <aside className="side">
        <Link href="/" className="brand">
          <strong>V &amp; A Flooring</strong>
          <span>Team CRM</span>
        </Link>
        <Nav />
        <div className="sideFoot">
          <span>Signed in as {user.name}</span>
          <form action={logout}>
            <button>Sign out</button>
          </form>
        </div>
      </aside>
      <main id="main" className="main">
        {children}
      </main>
    </div>
  );
}
