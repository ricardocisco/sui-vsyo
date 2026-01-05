interface MarketTypeIconProps {
  type: string;
  className?: string;
}

export function MarketTypeIcon({
  type,
  className = "w-5 h-5"
}: MarketTypeIconProps) {
  const getIcon = (marketType: string) => {
    switch (marketType) {
      case "Crypto":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Bitcoin Symbol - mais realista */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <path
              d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M10.5 8.5H12.5C13.6 8.5 14.5 9.4 14.5 10.5C14.5 11.6 13.6 12.5 12.5 12.5H10.5V15.5H9V8.5H10.5ZM10.5 11.5H12.5C13.05 11.5 13.5 11.05 13.5 10.5C13.5 9.95 13.05 9.5 12.5 9.5H10.5V11.5Z"
              fill="currentColor"
            />
            <path
              d="M15 8.5V9.5H16V10.5H15V13.5H16V14.5H15V15.5H13.5V14.5H12.5V13.5H13.5V10.5H12.5V9.5H13.5V8.5H15Z"
              fill="currentColor"
            />
          </svg>
        );
      case "Sports":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Soccer Ball */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M12 3L14.5 8.5L20 10L14.5 11.5L12 17L9.5 11.5L4 10L9.5 8.5L12 3Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M3 12L8.5 9.5L10 4L11.5 9.5L17 12L11.5 14.5L10 20L8.5 14.5L3 12Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M21 12L15.5 14.5L14 20L12.5 14.5L7 12L12.5 9.5L14 4L15.5 9.5L21 12Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        );
      case "Politics":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Gavel (Martelo de Juiz) */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            {/* Handle */}
            <rect
              x="10"
              y="8"
              width="4"
              height="8"
              rx="1"
              fill="currentColor"
            />
            {/* Head */}
            <rect x="6" y="6" width="8" height="3" rx="1" fill="currentColor" />
            {/* Strike face */}
            <rect
              x="5"
              y="5"
              width="10"
              height="2"
              rx="0.5"
              fill="currentColor"
              opacity="0.8"
            />
            {/* Base */}
            <rect
              x="8"
              y="16"
              width="8"
              height="2"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="9"
              y="18"
              width="6"
              height="1"
              rx="0.5"
              fill="currentColor"
              opacity="0.6"
            />
          </svg>
        );
      case "Finance":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Dollar Sign with Chart */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <path
              d="M12 4V20M9 7H12C13.1 7 14 7.9 14 9C14 10.1 13.1 11 12 11H10M9 17H12C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13H10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M6 18L8 15L11 17L14 12L18 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="6" cy="18" r="1" fill="currentColor" />
            <circle cx="18" cy="14" r="1" fill="currentColor" />
          </svg>
        );
      case "Tech":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Laptop/Computer */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <rect
              x="6"
              y="7"
              width="12"
              height="8"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="7"
              y="8"
              width="10"
              height="6"
              rx="0.5"
              fill="white"
              opacity="0.2"
            />
            <rect
              x="9"
              y="16"
              width="6"
              height="1"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="10"
              y="17"
              width="4"
              height="0.5"
              rx="0.25"
              fill="currentColor"
              opacity="0.6"
            />
            <circle cx="9" cy="10" r="0.5" fill="white" />
            <path
              d="M11 10H13"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        );
      case "Geopolitics":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Globe with continents */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <ellipse
              cx="12"
              cy="12"
              rx="9"
              ry="4"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
            <ellipse
              cx="12"
              cy="12"
              rx="4"
              ry="9"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M6 10C6 10 8 11 12 11C16 11 18 10 18 10M6 14C6 14 8 13 12 13C16 13 18 14 18 14"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            <circle cx="15" cy="15" r="1.5" fill="currentColor" />
          </svg>
        );
      case "Earnings":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Chart with upward trend */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <path
              d="M6 18L8 14L11 16L14 10L18 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M6 18L8 14L11 16L14 10L18 12"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
              opacity="0.3"
            />
            <circle cx="6" cy="18" r="1.5" fill="currentColor" />
            <circle cx="18" cy="12" r="1.5" fill="currentColor" />
            <path
              d="M18 12L20 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );
      case "Culture":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Theater Masks */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <path
              d="M8 8C8 8 9 6 12 6C15 6 16 8 16 8C16 10 14 12 12 12C10 12 8 10 8 8Z"
              fill="currentColor"
            />
            <path
              d="M8 16C8 16 9 18 12 18C15 18 16 16 16 16C16 14 14 12 12 12C10 12 8 14 8 16Z"
              fill="currentColor"
            />
            <circle cx="10" cy="9" r="1" fill="white" />
            <circle cx="14" cy="9" r="1" fill="white" />
            <circle cx="10" cy="15" r="1" fill="white" />
            <circle cx="14" cy="15" r="1" fill="white" />
            <path
              d="M10 11C10 11 11 12 12 12C13 12 14 11 14 11"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10 13C10 13 11 14 12 14C13 14 14 13 14 13"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );
      case "World":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Detailed Globe */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <ellipse
              cx="12"
              cy="12"
              rx="9"
              ry="4"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />
            <ellipse
              cx="12"
              cy="12"
              rx="4"
              ry="9"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M5 8C5 8 7 9 12 9C17 9 19 8 19 8M5 16C5 16 7 15 12 15C17 15 19 16 19 16"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="8" cy="7" r="1.2" fill="currentColor" />
            <circle cx="16" cy="17" r="1.2" fill="currentColor" />
            <circle cx="10" cy="14" r="0.8" fill="currentColor" />
            <circle cx="14" cy="10" r="0.8" fill="currentColor" />
          </svg>
        );
      case "Economy":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Economic Growth Chart */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <rect x="6" y="16" width="2" height="2" fill="currentColor" />
            <rect x="9" y="13" width="2" height="5" fill="currentColor" />
            <rect x="12" y="10" width="2" height="8" fill="currentColor" />
            <rect x="15" y="7" width="2" height="11" fill="currentColor" />
            <path
              d="M7 17L9.5 14.5L12 11.5L15.5 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="7" cy="17" r="1" fill="currentColor" />
            <circle cx="15.5" cy="8" r="1" fill="currentColor" />
          </svg>
        );
      case "Climate & Science":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Atom/Molecule */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <ellipse
              cx="12"
              cy="12"
              rx="8"
              ry="3"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              transform="rotate(45 12 12)"
            />
            <ellipse
              cx="12"
              cy="12"
              rx="8"
              ry="3"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              transform="rotate(-45 12 12)"
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="4" cy="12" r="1.5" fill="currentColor" />
            <circle cx="20" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="4" r="1.5" fill="currentColor" />
            <circle cx="12" cy="20" r="1.5" fill="currentColor" />
          </svg>
        );
      case "Elections":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Ballot Box */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <rect
              x="7"
              y="6"
              width="10"
              height="12"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="8"
              y="7"
              width="8"
              height="10"
              rx="0.5"
              fill="white"
              opacity="0.2"
            />
            <path
              d="M9 10H15M9 13H15M9 16H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="10.5" cy="10" r="0.8" fill="currentColor" />
            <circle cx="10.5" cy="13" r="0.8" fill="currentColor" />
            <circle cx="10.5" cy="16" r="0.8" fill="currentColor" />
            <path
              d="M12 4L13 6L15 5L14 7L16 7L14 8L15 10L13 9L12 11L11 9L9 10L10 8L8 7L10 7L9 5L11 6L12 4Z"
              fill="currentColor"
            />
          </svg>
        );
      case "Breaking":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Breaking News Badge */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <path
              d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"
              fill="currentColor"
            />
            <path
              d="M10 10L12 12L14 10M10 14L12 12L14 14"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="1.5" fill="white" />
          </svg>
        );
      case "New":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Sparkle/Star */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill="currentColor"
            />
            <circle cx="12" cy="12" r="3" fill="white" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        );
      case "Trending":
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            {/* Trending Up Chart */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <path
              d="M6 18L9 14L12 16L16 10L18 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M18 12L20 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="6" cy="18" r="1.5" fill="currentColor" />
            <circle cx="18" cy="12" r="1.5" fill="currentColor" />
            <path
              d="M16 10L18 8L20 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path d="M12 6V18M6 12H18" stroke="white" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div className="flex items-center justify-center">{getIcon(type)}</div>
  );
}
