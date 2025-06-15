
import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  status: string;
}
const statusColor = (s: string) => {
  if (!s) return "bg-gray-300 text-gray-900";
  switch (s.toLowerCase()) {
    case "critical":
      return "bg-red-500 text-white";
    case "high":
    case "busy":
      return "bg-orange-500 text-white";
    case "medium":
      return "bg-yellow-400 text-black";
    case "low":
    case "available":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-300 text-gray-900";
  }
};

export const StatusBadge: React.FC<Props> = ({ status }) => (
  <span className={cn("px-2 py-1 rounded text-xs font-bold", statusColor(status))}>
    {status}
  </span>
);
