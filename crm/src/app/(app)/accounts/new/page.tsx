import { PageHead } from "@/components/ui";
import { createAccount } from "../actions";
import { AccountForm } from "../AccountForm";

export const metadata = { title: "New account" };

export default function NewAccount() {
  return (
    <>
      <PageHead title="New account" sub="A property management company or other repeat customer." crumbs={[{ href: "/accounts", label: "Accounts" }]} />
      <div className="card">
        <AccountForm action={createAccount} submitLabel="Create account" />
      </div>
    </>
  );
}
