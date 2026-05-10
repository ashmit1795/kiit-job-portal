import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  height?: number;
  className?: string;
  showText?: boolean;
}

/**
 * अवSaar brand logo — uses the official logo.png asset and displays text.
 */
export function Logo({ href = "/", height = 36, className = "", showText = true }: LogoProps) {
  // Assume logo is roughly square (e.g. M icon)
  const width = height;

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="अवSaar Logo"
        width={width}
        height={height}
        className="object-contain"
        style={{ height: `${height}px`, width: "auto" }}
        priority
      />
      {showText && (
        <span className="font-bold tracking-tight" style={{ fontSize: `${Math.max(16, height * 0.65)}px` }}>
          अवSaar
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  );
}
