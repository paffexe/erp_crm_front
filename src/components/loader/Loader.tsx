/**
 * Skeleton Loader Component
 * A lazy loading fallback with smooth pulse animation
 * Uses the brand color palette for professional appearance
 */

export const SkeletonLoader = ({
  className = "",
  lines = 3,
  showAvatar = true,
  animated = true,
}: {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
  animated?: boolean;
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Avatar and Title */}
      {showAvatar && (
        <div className="flex items-center gap-4">
          <div
            className={`h-12 w-12 rounded-lg ${
              animated ? "animate-pulse" : ""
            } bg-brand-accent/30`}
          />
          <div className="flex-1 space-y-2">
            <div
              className={`h-4 w-3/4 rounded ${
                animated ? "animate-pulse" : ""
              } bg-brand-tertiary/20`}
            />
            <div
              className={`h-3 w-1/2 rounded ${
                animated ? "animate-pulse" : ""
              } bg-brand-accent/20`}
            />
          </div>
        </div>
      )}

      {/* Content Lines */}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded ${animated ? "animate-pulse" : ""} ${
              i === lines - 1
                ? "w-4/5 bg-brand-accent/15"
                : "w-full bg-brand-tertiary/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Card Skeleton Loader
 * A card-shaped loading skeleton for content containers
 */
export const CardSkeletonLoader = ({
  className = "",
  animated = true,
  variant = "default",
}: {
  className?: string;
  animated?: boolean;
  variant?: "default" | "compact" | "wide";
}) => {
  const getCardSize = () => {
    switch (variant) {
      case "compact":
        return "h-24";
      case "wide":
        return "h-40";
      default:
        return "h-32";
    }
  };

  return (
    <div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div
            className={`h-5 w-2/3 rounded ${
              animated ? "animate-pulse" : ""
            } bg-brand-primary/20`}
          />
          <div
            className={`h-3 w-1/2 rounded ${
              animated ? "animate-pulse" : ""
            } bg-brand-accent/15`}
          />
        </div>
        <div
          className={`h-8 w-8 rounded ${
            animated ? "animate-pulse" : ""
          } bg-brand-tertiary/20`}
        />
      </div>

      {/* Content Area */}
      <div
        className={`${getCardSize()} rounded ${
          animated ? "animate-pulse" : ""
        } bg-brand-secondary/10`}
      />

      {/* Footer */}
      <div className="mt-4 flex gap-2">
        <div
          className={`h-9 flex-1 rounded ${
            animated ? "animate-pulse" : ""
          } bg-brand-primary/15`}
        />
        <div
          className={`h-9 w-20 rounded ${
            animated ? "animate-pulse" : ""
          } bg-brand-accent/20`}
        />
      </div>
    </div>
  );
};

/**
 * Grid Skeleton Loader
 * Multiple skeleton cards in a responsive grid
 */
export const GridSkeletonLoader = ({
  count = 3,
  className = "",
  animated = true,
  columns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  className?: string;
  animated?: boolean;
  columns?: string;
}) => {
  return (
    <div className={`grid gap-6 ${columns} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeletonLoader key={i} animated={animated} />
      ))}
    </div>
  );
};

/**
 * Table Skeleton Loader
 * A table-row loading skeleton
 */
export const TableSkeletonLoader = ({
  rows = 5,
  columns = 5,
  className = "",
  animated = true,
}: {
  rows?: number;
  columns?: number;
  className?: string;
  animated?: boolean;
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex gap-4 border-b border-border pb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className={`h-4 flex-1 rounded ${
              animated ? "animate-pulse" : ""
            } bg-brand-primary/20`}
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={`cell-${colIdx}`}
              className={`h-3 flex-1 rounded ${
                animated ? "animate-pulse" : ""
              } ${
                colIdx % 2 === 0 ? "bg-brand-tertiary/15" : "bg-brand-accent/15"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Wave Skeleton Loader
 * An animated wave effect skeleton
 */
export const WaveSkeletonLoader = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hero Section */}
      <div className="space-y-3">
        <div className="h-10 w-2/3 rounded-lg bg-gradient-to-r from-brand-primary/20 via-brand-tertiary/20 to-brand-primary/20 bg-[length:200%_100%] animate-pulse" />
        <div className="h-6 w-full rounded-lg bg-gradient-to-r from-brand-accent/15 via-brand-accent/25 to-brand-accent/15 bg-[length:200%_100%] animate-pulse" />
        <div className="h-6 w-5/6 rounded-lg bg-gradient-to-r from-brand-accent/15 via-brand-accent/25 to-brand-accent/15 bg-[length:200%_100%] animate-pulse" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-8 rounded bg-gradient-to-r from-brand-secondary/20 via-brand-primary/20 to-brand-secondary/20 bg-[length:200%_100%] animate-pulse" />
            <div className="h-24 rounded-lg bg-gradient-to-r from-brand-secondary/10 via-brand-secondary/15 to-brand-secondary/10 bg-[length:200%_100%] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Circular Progress Loader
 * A rotating circle loader with brand colors
 */
export const CircularProgressLoader = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeMap[size]} relative`}>
        <svg
          className="absolute inset-0 animate-spin"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-primary)" />
              <stop offset="100%" stopColor="var(--brand-tertiary)" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#grad)"
            strokeWidth="3"
            strokeDasharray="141.37 141.37"
            strokeLinecap="round"
          />
        </svg>
        <div
          className={`${sizeMap[size]} rounded-full border-2 border-brand-accent/20`}
        />
      </div>
    </div>
  );
};

/**
 * Shimmer Loader
 * A shimmer effect loader
 */
export const ShimmerLoader = ({
  width = "w-full",
  height = "h-40",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) => {
  return (
    <div
      className={`overflow-hidden rounded-lg ${width} ${height} ${className}`}
    >
      <div
        className={`h-full w-full animate-shimmer bg-gradient-to-r from-brand-secondary/10 via-brand-accent/20 to-brand-secondary/10 bg-[length:200%_100%]`}
        style={{
          animation: "shimmer 2s infinite",
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export const HelpMeHelpYou = ({
  isVisible = true,
  message = "Loading your data...",
  className = "",
}: {
  isVisible?: boolean;
  message?: string;
  className?: string;
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${className}`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Spinner */}
        <div className="relative h-16 w-16">
          {/* Outer rotating ring */}
          <svg
            className="absolute inset-0 animate-spin"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradientOuter)"
              strokeWidth="4"
              strokeDasharray="141.37 141.37"
              strokeLinecap="round"
              opacity="0.8"
            />
            <defs>
              <linearGradient
                id="gradientOuter"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--brand-primary)" />
                <stop offset="100%" stopColor="var(--brand-tertiary)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner rotating ring (opposite direction) */}
          <svg
            className="absolute inset-0 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "2s" }}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="30"
              stroke="url(#gradientInner)"
              strokeWidth="3"
              strokeDasharray="94.24 94.24"
              strokeLinecap="round"
              opacity="0.6"
            />
            <defs>
              <linearGradient
                id="gradientInner"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="var(--brand-accent)" />
                <stop offset="100%" stopColor="var(--brand-secondary)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-brand-primary" />
          </div>
        </div>

        {/* Message Text */}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground text-balance">
            {message}
          </p>
          <p className="text-xs text-muted-foreground">Just a moment...</p>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-brand-tertiary/60"
              style={{
                animation: `bounce 1.4s infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
