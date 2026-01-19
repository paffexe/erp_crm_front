import { Badge } from "@/components/ui/badge";

interface StudentStatusBadgeProps {
  isBlocked: boolean;
  isActive: boolean;
}

export const StudentStatusBadge = ({
  isBlocked,
  isActive,
}: StudentStatusBadgeProps) => {
  if (isBlocked) {
    return (
      <Badge
        className="font-medium"
        style={{
          backgroundColor: "rgba(192, 90, 78, 0.15)",
          color: "var(--brand-error)",
        }}
      >
        Blocked
      </Badge>
    );
  }

  if (isActive) {
    return (
      <Badge
        className="font-medium"
        style={{
          backgroundColor: "rgba(125, 166, 125, 0.15)",
          color: "var(--brand-success)",
        }}
      >
        Active
      </Badge>
    );
  }

  return (
    <Badge
      className="font-medium"
      style={{
        backgroundColor: "rgba(69, 104, 130, 0.15)",
        color: "var(--brand-tertiary)",
      }}
    >
      Inactive
    </Badge>
  );
};
