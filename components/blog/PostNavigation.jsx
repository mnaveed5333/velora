import Link from "next/link";

export default function PostNavigation({ prev, next }) {
  return (
    <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 text-sm">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="group flex flex-col">
          <span className="text-xs text-slate-400">← PREVIOUS</span>
          <span className="mt-1 font-medium text-ink group-hover:text-primary line-clamp-1">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={`/blog/${next.slug}`} className="group flex flex-col items-end">
          <span className="text-xs text-slate-400">NEXT →</span>
          <span className="mt-1 font-medium text-ink group-hover:text-primary line-clamp-1">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}