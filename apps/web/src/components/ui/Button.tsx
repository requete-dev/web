import Link from "next/link";

type ButtonProps = {
  href: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  children: React.ReactNode;
  className?: string;
};

const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40",
  outline:
    "border border-gray-600 text-gray-200 hover:border-primary-400 hover:text-white hover:bg-white/5",
  ghost: "text-gray-300 hover:text-white hover:bg-white/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  external,
  children,
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
