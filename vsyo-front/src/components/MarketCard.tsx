import { Link } from "react-router-dom";
import { Clock, Users, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { cn } from "../lib/utils";

interface MarketCardProps {
  id: string;
  title: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume: string;
  traders: number;
  endDate: string;
  trend: "up" | "down" | "neutral";
  isHot?: boolean;
}

export function MarketCard({
  id,
  title,
  category,
  yesPrice,
  noPrice,
  volume,
  traders,
  endDate,
  trend,
  isHot
}: MarketCardProps) {
  const yesPercentage = Math.round(yesPrice * 100);
  const noPercentage = Math.round(noPrice * 100);

  return (
    <Link to={`/market/${id}`} className="block">
      <div className="inset-0 bg-linear-to-br from-primary/10 via-transparent to-cyan-500/5 p-4 rounded-xl border border-primary/20">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="stat-pill bg-secondary text-muted-foreground">
                {category}
              </span>
              {isHot && (
                <span className="stat-pill bg-warning/20 text-warning">
                  <Zap className="w-3 h-3" />
                  Hot
                </span>
              )}
            </div>
            <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>

          {/* Trend Indicator */}
          <div
            className={cn(
              "shrink-0 p-2 rounded-lg",
              trend === "up"
                ? "bg-success/10 text-success"
                : trend === "down"
                ? "bg-destructive/10 text-destructive"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend === "down" ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <div className="w-4 h-1 bg-current rounded-full" />
            )}
          </div>
        </div>

        {/* Probability Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-success">
                {yesPercentage}%
              </span>
              <span className="text-sm text-muted-foreground">SIM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">NÃO</span>
              <span className="text-2xl font-bold text-destructive">
                {noPercentage}%
              </span>
            </div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success to-success/70 rounded-full transition-all duration-500"
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {traders.toLocaleString()}
            </span>
            <span className="font-mono">${volume}</span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {endDate}
          </span>
        </div>
      </div>
    </Link>
  );
}
