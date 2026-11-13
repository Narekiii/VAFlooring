"use client";

import { useActionState } from "react";
import { addUser, changePassword } from "./actions";

function Msg({ s }: { s?: { error?: string; ok?: string; values?: Record<string, string> } }) {
  if (s?.error)
    return (
      <p className="error" role="alert">
        {s.error}
      </p>
    );
  if (s?.ok)
    return (
      <p className="notice" role="status">
        {s.ok}
      </p>
    );
  return null;
}

export function AddUserForm() {
  const [state, action, pending] = useActionState(addUser, undefined);
  return (
    <form action={action} className="stack" style={{ gap: 10 }} key={state?.error ?? state?.ok ?? "form"}>
      <Msg s={state} />
      <div className="field">
        <label htmlFor="u-name">Name *</label>
        <input id="u-name" name="name" required autoComplete="off" defaultValue={state?.values?.name} />
      </div>
      <div className="field">
        <label htmlFor="u-email">Email *</label>
        <input id="u-email" name="email" type="email" required autoComplete="off" defaultValue={state?.values?.email} />
      </div>
      <div className="field">
        <label htmlFor="u-pass">Temporary password *</label>
        <input id="u-pass" name="password" type="text" minLength={10} required autoComplete="new-password" />
        <span className="hint">At least 10 characters. Share it with them privately.</span>
      </div>
      <div>
        <button className="btn btnPrimary" disabled={pending}>
          Add team member
        </button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="stack" style={{ gap: 10 }}>
      <Msg s={state} />
      <div className="field">
        <label htmlFor="pw-cur">Current password</label>
        <input id="pw-cur" name="current" type="password" required autoComplete="current-password" />
      </div>
      <div className="field">
        <label htmlFor="pw-new">New password</label>
        <input id="pw-new" name="next" type="password" minLength={10} required autoComplete="new-password" />
      </div>
      <div>
        <button className="btn" disabled={pending}>
          Change password
        </button>
      </div>
    </form>
  );
}
