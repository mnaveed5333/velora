import Link from "next/link";

export default function FooterLinkColumn({ title, links, activeHref }) {
  return (
    <div>
      <h4 className="mb-5 text-lg font-bold text-white">{title}</h4>
      <ul className="space-y-3.5">
        {links.map((link) => {
          const isActive = link.href === activeHref;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  isActive
                    ? "text-base text-red-500"
                    : "text-base text-slate-200 transition-colors hover:text-primary"
                }
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}