import Link from "next/link";

export default function NavItem({
  href,
  icon: Icon,
  className,
  children,
}: {
  href: string;
  icon: React.ElementType;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-300 ${className}`}>
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
}
