import { llmsFullTxt } from "@/lib/llms";

/** /llms-full.txt — the full service content, FAQs and company facts as one plain-text file. */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
