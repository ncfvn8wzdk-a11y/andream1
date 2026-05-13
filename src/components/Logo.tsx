interface LogoProps {
  size?: "small" | "medium" | "large";
  variant?: "light" | "dark";
  showText?: boolean;
}

export default function Logo({
  size = "medium",
  variant = "dark",
  showText = true,
}: LogoProps) {
  const sizes = {
    small: { width: 32, height: 32, textSize: "text-sm" },
    medium: { width: 48, height: 48, textSize: "text-lg" },
    large: { width: 64, height: 64, textSize: "text-2xl" },
  };

  const colors = {
    light: { bg: "bg-white", text: "text-white", icon: "text-blue-600" },
    dark: { bg: "bg-slate-900", text: "text-white", icon: "text-blue-400" },
  };

  const { width, height, textSize } = sizes[size];
  const { icon } = colors[variant];

  return (
    <div className="flex items-center gap-3">
      <svg
        width={width}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill="url(#gradient)" opacity="0.1" />

        {/* Main icon: Location pin with automation symbol */}
        <g>
          {/* Pin shape */}
          <path
            d="M32 12C24.268 12 18 18.268 18 26C18 35 32 50 32 50C32 50 46 35 46 26C46 18.268 39.732 12 32 12Z"
            fill="currentColor"
            className={icon}
          />

          {/* Circle inside pin */}
          <circle cx="32" cy="26" r="6" fill="white" />

          {/* Automation gear symbol inside circle */}
          <g transform="translate(32, 26)">
            {/* Center dot */}
            <circle cx="0" cy="0" r="1.5" fill="currentColor" className={icon} />

            {/* Rotation arcs */}
            <circle
              cx="0"
              cy="-2"
              r="0.8"
              fill="currentColor"
              className={icon}
              opacity="0.8"
            />
            <circle
              cx="1.4"
              cy="-1.4"
              r="0.8"
              fill="currentColor"
              className={icon}
              opacity="0.6"
            />
          </g>
        </g>

        {/* Gradient definition */}
        <defs>
          <linearGradient
            id="gradient"
            x1="0"
            y1="0"
            x2="64"
            y2="64"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSize} font-bold text-gray-900`}>
            Malvestiti
          </span>
          <span className="text-xs font-semibold text-blue-600">Automation</span>
        </div>
      )}
    </div>
  );
}
