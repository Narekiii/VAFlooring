import { llmsTxt } from "@/lib/llms";

/** /llms.txt — short summary of the business for AI assistants and answer engines (llmstxt.org). */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
