import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { fmtDate, lineCents, money, unitShort } from "@/lib/format";
import { PrintButton } from "@/components/PrintButton";
import { loadEstimate } from "@/app/(app)/estimates/data";
import { COMPANY } from "@/lib/company";

export const dynamic = "force-dynamic";
export const metadata = { title: "Estimate" };

export default async function PrintEstimate({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const data = await loadEstimate(id);
  if (!data) notFound();
  const { est, items, account, property, total } = data;
  const billTo = account?.name ?? est.customerName;
  return (
    <div className="printPage">
      <div className="noPrint row" style={{ justifyContent: "space-between", marginBottom: 24 }}>
        <Link href={`/estimates/${id}`}>← Back to {est.number}</Link>
        <PrintButton />
      </div>
      <article className="sheet">
        <header className="sheetHead">
          <div>
            <p className="sheetBrand">V &amp; A Flooring Inc</p>
            <p className="small">
              {COMPANY.address}
              <br />
              {COMPANY.phone} · {COMPANY.email} · {COMPANY.web}
              <br />
              {COMPANY.license}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h1 style={{ fontSize: "1.8rem" }}>Estimate</h1>
            <p>
              <strong>{est.number}</strong>
            </p>
            <p className="small">Date: {fmtDate(est.sentAt ?? est.createdAt)}</p>
          </div>
        </header>

        <section className="sheetParties">
          <div>
            <p className="sheetLabel">Prepared for</p>
            <p>
              <strong>{billTo ?? "—"}</strong>
            </p>
            {account?.address && <p className="small">{account.address}</p>}
          </div>
          <div>
            <p className="sheetLabel">Job site</p>
            <p>
              <strong>{[property?.name, est.unitLabel].filter(Boolean).join(" · ") || "—"}</strong>
            </p>
            {(est.siteAddress ?? property?.address) && <p className="small">{est.siteAddress ?? property?.address}</p>}
          </div>
        </section>

        <h2 style={{ margin: "8px 0 10px" }}>{est.title}</h2>
        <table className="table sheetTable">
          <thead>
            <tr>
              <th>Description</th>
              <th className="num">Quantity</th>
              <th className="num">Rate</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>
                  <strong>{it.name}</strong>
                  {it.description && <div className="small">{it.description}</div>}
                </td>
                <td className="num">
                  {Number(it.qty).toLocaleString("en-US")} {unitShort[it.unit]}
                </td>
                <td className="num">
                  {money(it.rateCents)}/{unitShort[it.unit]}
                </td>
                <td className="num">{money(lineCents(it.qty, it.rateCents))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Total</td>
              <td className="num">{money(total)}</td>
            </tr>
          </tfoot>
        </table>

        {est.notes && (
          <section style={{ marginTop: 18 }}>
            <p className="sheetLabel">Notes</p>
            <p style={{ whiteSpace: "pre-wrap" }}>{est.notes}</p>
          </section>
        )}

        <section className="sheetSign">
          <div>
            <span />
            <p className="small">Accepted by (name and signature)</p>
          </div>
          <div>
            <span />
            <p className="small">Date</p>
          </div>
        </section>
        <footer className="small sheetFoot">Thank you for choosing V &amp; A Flooring Inc. Family owned since 1999.</footer>
      </article>
    </div>
  );
}
