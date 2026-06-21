import Link from "next/link";

export default function Button({ href, variant = "primary", children, className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    dark: "bg-ink text-white hover:bg-black",
    outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}