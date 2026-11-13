"use client";

import { useActionState, useState } from "react";
import { signIn } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);
  // Controlled so the username survives a failed attempt (React resets uncontrolled form fields after an action).
  const [username, setUsername] = useState("");
  return (
    <form action={action} className="form">
      {state?.error && (
        <p className="alert" role="alert">
          {state.error}
        </p>
      )}
      <div className="field">
        <label htmlFor="username">Username</label>
        <input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="btn btnPrimary" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
