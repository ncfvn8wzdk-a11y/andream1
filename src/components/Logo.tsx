import Link from "next/link";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  href?: string;
}

export default function Logo({
  size = "medium",
  showText = true,
  href = "/dashboard",
}: LogoProps) {
  const sizes = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-20 h-20",
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-2xl",
  };

  const logoElement = (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Malvestiti Automation Logo */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#2563eb", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#1e40af", stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Background */}
          <circle cx="100" cy="100" r="98" fill="none" stroke="url(#logoGradient)" strokeWidth="2" />

          {/* Main M letter - stylized */}
          <g transform="translate(50, 50)">
            {/* Left vertical line of M */}
            <rect x="10" y="20" width="8" height="60" fill="#2563eb" rx="4" />

            {/* Right vertical line of M */}
            <rect x="82" y="20" width="8" height="60" fill="#2563eb" rx="4" />

            {/* Peak lines forming M shape */}
            <path d="M 18 20 L 46 50 L 74 20" stroke="#2563eb" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {/* Automation gear in center */}
            <g transform="translate(46, 75)">
              <circle cx="0" cy="0" r="12" fill="none" stroke="#2563eb" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" fill="#2563eb" />

              {/* Gear teeth */}
              <rect x="-2" y="-18" width="4" height="6" fill="#2563eb" />
              <rect x="-2" y="12" width="4" height="6" fill="#2563eb" />
              <rect x="12" y="-2" width="6" height="4" fill="#2563eb" />
              <rect x="-18" y="-2" width="6" height="4" fill="#2563eb" />
            </g>
          </g>

          {/* Text below logo */}
          <text
            x="100"
            y="170"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#2563eb"
            fontFamily="Arial, sans-serif"
          >
            MALVESTITI
          </text>
          <text
            x="100"
            y="188"
            textAnchor="middle"
            fontSize="10"
            fill="#1e40af"
            fontFamily="Arial, sans-serif"
          >
            AUTOMATION
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-bold text-gray-900`}>
            Malvestiti
          </span>
          <span className="text-xs font-semibold text-blue-600">Automation</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
