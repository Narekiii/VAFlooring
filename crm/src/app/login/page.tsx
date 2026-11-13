import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isSignedIn()) redirect("/");
  return (
    <main className="login">
      <div className="loginCard">
        <p className="loginMark">
          V &amp; A Flooring<span>Prospecting</span>
        </p>
        <h1>Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
