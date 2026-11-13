"use client";

import { useActionState, useMemo, useState } from "react";
import type { EstimateState } from "./actions";

type Unit = "sqft" | "lf" | "each";
type Price = { code: string; name: string; description: string | null; unit: Unit; rateCents: number };
type Row = { key: number; name: string; description: string; unit: Unit; qty: string; rate: string };
type Init = {
  title?: string | null;
  accountId?: number | null;
  propertyId?: number | null;
  leadId?: number | null;
  customerName?: string | null;
  siteAddress?: string | null;
  unitLabel?: string | null;
  notes?: string | null;
  items?: { name: string; description: string | null; unit: Unit; qty: string; rateCents: number }[];
};

const UNITS: Record<Unit, string> = { sqft: "sq ft", lf: "linear ft", each: "each" };
const usd = (c: number) => (c / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
let seq = 1;

export function EstimateEditor({
  init,
  accounts,
  properties,
  leads,
  priceLists,
  action,
  submitLabel,
}: {
  init: Init;
  accounts: { id: number; name: string; address: string | null }[];
  properties: { id: number; accountId: number; name: string; address: string | null }[];
  leads: { id: number; name: string; address: string | null }[];
  /** "std" plus one per account id. */
  priceLists: Record<string, Price[]>;
  action: (state: EstimateState, form: FormData) => Promise<EstimateState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [accountId, setAccountId] = useState<string>(init.accountId ? String(init.accountId) : "");
  const [propertyId, setPropertyId] = useState<string>(init.propertyId ? String(init.propertyId) : "");
  const [siteAddress, setSiteAddress] = useState(init.siteAddress ?? "");
  const [rows, setRows] = useState<Row[]>(() =>
    (init.items ?? []).map((it) => ({ key: seq++, name: it.name, description: it.description ?? "", unit: it.unit, qty: String(Number(it.qty)), rate: (it.rateCents / 100).toFixed(2) })),
  );
  const prices = priceLists[accountId] ?? priceLists.std ?? [];
  const props = properties.filter((p) => String(p.accountId) === accountId);

  const cents = (r: Row) => Math.round((Number(r.qty) || 0) * Math.round((Number(r.rate) || 0) * 100));
  const total = rows.reduce((a, r) => a + cents(r), 0);
  const json = useMemo(
    () =>
      JSON.stringify(
        rows.filter((r) => r.name.trim()).map((r) => ({ name: r.name, description: r.description || null, unit: r.unit, qty: Number(r.qty) || 0, rateCents: Math.round((Number(r.rate) || 0) * 100) })),
      ),
    [rows],
  );

  const add = (p?: Price) =>
    setRows((rs) => [
      ...rs,
      p
        ? { key: seq++, name: p.name, description: p.description ?? "", unit: p.unit, qty: "", rate: (p.rateCents / 100).toFixed(2) }
        : { key: seq++, name: "", description: "", unit: "each", qty: "1", rate: "" },
    ]);
  const set = (key: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  return (
    <form action={formAction} className="stack">
      {state?.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <section className="card" aria-labelledby="est-details">
        <h2 id="est-details">Details</h2>
        <div className="form">
          <div className="field full">
            <label htmlFor="e-title">Estimate title *</label>
            <input id="e-title" name="title" required defaultValue={init.title ?? ""} placeholder="e.g. Unit 12B turnover – LVP and baseboards" />
          </div>
          <div className="field">
            <label htmlFor="e-account">Account</label>
            <select
              id="e-account"
              name="accountId"
              value={accountId}
              onChange={(e) => {
                setAccountId(e.target.value);
                setPropertyId("");
              }}
            >
              <option value="">No account (individual customer)</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <span className="hint">The account’s own rates are used for new lines.</span>
          </div>
          <div className="field">
            <label htmlFor="e-property">Property</label>
            <select
              id="e-property"
              name="propertyId"
              value={propertyId}
              disabled={!accountId}
              onChange={(e) => {
                setPropertyId(e.target.value);
                const p = properties.find((x) => String(x.id) === e.target.value);
                if (p?.address && !siteAddress) setSiteAddress(p.address);
              }}
            >
              <option value="">{accountId ? (props.length ? "Choose a property" : "No properties on this account") : "Choose an account first"}</option>
              {props.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="e-unit">Unit / area</label>
            <input id="e-unit" name="unitLabel" defaultValue={init.unitLabel ?? ""} placeholder="e.g. Unit 12B" />
          </div>
          <div className="field">
            <label htmlFor="e-customer">Customer name</label>
            <input id="e-customer" name="customerName" defaultValue={init.customerName ?? ""} placeholder="Shown on the estimate if there’s no account" />
          </div>
          <div className="field full">
            <label htmlFor="e-site">Job site address</label>
            <input id="e-site" name="siteAddress" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="e-lead">Lead</label>
            <select id="e-lead" name="leadId" defaultValue={init.leadId ? String(init.leadId) : ""}>
              <option value="">Not linked</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="est-items">
        <div className="cardHead">
          <h2 id="est-items">Line items</h2>
          <div className="actions">
            {prices.map((p) => (
              <button key={p.code} type="button" className="btn btnSmall" onClick={() => add(p)}>
                + {p.name} ({usd(p.rateCents)}/{UNITS[p.unit]})
              </button>
            ))}
            <button type="button" className="btn btnSmall" onClick={() => add()}>
              + Custom line
            </button>
          </div>
        </div>
        <div className="tableWrap">
          <table className="table itemsTable">
            <thead>
              <tr>
                <th style={{ minWidth: 220 }}>Description</th>
                <th style={{ width: 110 }}>Qty</th>
                <th style={{ width: 130 }}>Unit</th>
                <th style={{ width: 120 }}>Rate ($)</th>
                <th className="num" style={{ width: 120 }}>
                  Amount
                </th>
                <th style={{ width: 70 }}>
                  <span className="visually-hidden">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    Add a line from the price list above.
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={r.key}>
                  <td>
                    <label className="visually-hidden" htmlFor={`n-${r.key}`}>
                      Line {i + 1} item
                    </label>
                    <input id={`n-${r.key}`} value={r.name} onChange={(e) => set(r.key, { name: e.target.value })} required />
                    <label className="visually-hidden" htmlFor={`d-${r.key}`}>
                      Line {i + 1} details
                    </label>
                    <input id={`d-${r.key}`} value={r.description} onChange={(e) => set(r.key, { description: e.target.value })} placeholder="Details (optional)" style={{ marginTop: 4, fontSize: "0.85rem" }} />
                  </td>
                  <td>
                    <label className="visually-hidden" htmlFor={`q-${r.key}`}>
                      Line {i + 1} quantity
                    </label>
                    <input id={`q-${r.key}`} type="number" min="0" step="0.01" inputMode="decimal" value={r.qty} onChange={(e) => set(r.key, { qty: e.target.value })} required />
                  </td>
                  <td>
                    <label className="visually-hidden" htmlFor={`u-${r.key}`}>
                      Line {i + 1} unit
                    </label>
                    <select id={`u-${r.key}`} value={r.unit} onChange={(e) => set(r.key, { unit: e.target.value as Unit })}>
                      {(Object.keys(UNITS) as Unit[]).map((u) => (
                        <option key={u} value={u}>
                          {UNITS[u]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <label className="visually-hidden" htmlFor={`r-${r.key}`}>
                      Line {i + 1} rate in dollars
                    </label>
                    <input id={`r-${r.key}`} type="number" min="0" step="0.01" inputMode="decimal" value={r.rate} onChange={(e) => set(r.key, { rate: e.target.value })} required />
                  </td>
                  <td className="num">{usd(cents(r))}</td>
                  <td>
                    <button type="button" className="linkBtn linkDanger" onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}>
                      Remove<span className="visually-hidden"> line {i + 1}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="totalRow" aria-live="polite">
          <span>Total</span>
          <span>{usd(total)}</span>
        </p>
      </section>

      <section className="card" aria-labelledby="est-notes">
        <h2 id="est-notes">Notes on the estimate</h2>
        <label htmlFor="e-notes" className="visually-hidden">
          Notes printed on the estimate
        </label>
        <textarea id="e-notes" name="notes" defaultValue={init.notes ?? ""} placeholder="Printed on the estimate, e.g. scope, schedule or access notes." />
      </section>

      <input type="hidden" name="items" value={json} />
      <div>
        <button className="btn btnPrimary" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
