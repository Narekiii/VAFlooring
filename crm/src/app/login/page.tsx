import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { needsSetup } from "../actions-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentUser()) redirect("/");
  const setup = await needsSetup();
  return (
    <main className="loginPage">
      <div className="loginCard">
        <p className="brandDark">
          <strong>V &amp; A Flooring</strong>
          <span>Team CRM</span>
        </p>
        <h1>{setup ? "Create the first account" : "Sign in"}</h1>
        {setup && (
          <p className="muted small">
            No one has an account yet. The person who sets this up can add the rest of the team under Settings › Team.
          </p>
        )}
        <LoginForm setup={setup} />
      </div>
    </main>
  );
}
