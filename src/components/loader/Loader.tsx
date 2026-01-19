import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
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
