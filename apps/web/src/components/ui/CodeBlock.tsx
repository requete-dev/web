import { highlightCode } from "@/lib/highlight";

export async function CodeBlock({
  code,
  title,
}: {
  code: string;
  title?: string;
}) {
  const html = await highlightCode(code);

  return (
    <div className="rounded-xl border border-gray-700/50 bg-surface-950 overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700/50 bg-surface-800/50">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-gray-400 font-mono ml-2">{title}</span>
        </div>
      )}
      <div
        className="shiki-wrapper p-4 overflow-x-auto text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
