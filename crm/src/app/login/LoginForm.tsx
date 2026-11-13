"use client";

import { useActionState } from "react";
import { login, setupFirstUser } from "../actions-auth";

export function LoginForm({ setup }: { setup: boolean }) {
  const [state, action, pending] = useActionState(setup ? setupFirstUser : login, undefined);
  return (
    <form action={action} className="stack" key={state?.error ?? "form"}>
      {state?.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      {setup && (
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" autoComplete="name" required defaultValue={state?.values?.name} />
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state?.values?.email} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete={setup ? "new-password" : "current-password"} minLength={setup ? 10 : undefined} required />
        {setup && <span className="hint">At least 10 characters.</span>}
      </div>
      <button className="btn btnPrimary" disabled={pending}>
        {pending ? "Please wait…" : setup ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
