
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, string> = {
  "new": "status-badge-new",
  "ny": "status-badge-new",
  "contacted": "status-badge-contacted",
  "kontaktet": "status-badge-contacted",
  "qualified": "status-badge-qualified",
  "kvalifisert": "status-badge-qualified",
  "proposal": "status-badge-proposal",
  "tilbud": "status-badge-proposal",
  "closed": "status-badge-closed",
  "avsluttet": "status-badge-closed",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const statusClass = statusMap[normalizedStatus] || "bg-gray-500";
  
  return (
    <span className={cn("status-badge", statusClass, className)}>
      {status}
    </span>
  );
}
