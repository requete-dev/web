import { codeToHtml } from "shiki";

export async function highlightCode(
  code: string,
  lang = "python",
): Promise<string> {
  return codeToHtml(code, { lang, theme: "github-dark" });
}
