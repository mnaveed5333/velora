import Link from "next/link";

export default function SupportLinkItem({ href = "#", label }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-gray-800 underline underline-offset-4 hover:text-red-600"
      >
        {label}
      </Link>
    </li>
  );
}