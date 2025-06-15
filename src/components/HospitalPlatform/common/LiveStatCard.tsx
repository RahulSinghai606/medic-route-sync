
import React from "react";
import { cn } from "@/lib/utils";

interface LiveStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon?: React.ReactNode;
  loading?: boolean;
  accentColor?: string;
}

const LiveStatCard: React.FC<LiveStatCardProps> = ({
  title,
  value,
  unit,
  trend,
  icon,
  loading,
  accentColor = "from-blue-500 to-purple-500"
}) => {
  return (
    <div className={`group rounded-xl bg-gradient-to-br ${accentColor} text-white shadow-lg p-5 relative overflow-hidden`}>
      <div className="absolute top-2 right-3 opacity-50 group-hover:opacity-90 transition">{icon}</div>
      <div className="text-xs uppercase tracking-wider mb-1 opacity-75">{title}</div>
      <div className="flex items-end gap-2">
        {loading ? (
          <span className="w-12 h-7 bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="text-3xl font-bold">{value}{unit}</span>
        )}
        {!!trend && (
          <span className={trend > 0 ? "text-green-200" : "text-red-200"}>
            {trend > 0 ? "↑" : "↓"}{Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default LiveStatCard;
