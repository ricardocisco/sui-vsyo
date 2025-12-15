import { Link } from "react-router-dom";
import { RefreshCw, Bookmark } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface MarketOption {
  label: string;
  probability: number;
}

interface MarketCardProps {
  id: string;
  title: string;
  category: string;
  icon?: string;
  options: MarketOption[];
  volume: string;
  hasChanceIndicator?: boolean;
  chanceValue?: number;
  hasLargeButtons?: boolean;
  creatorName?: string;
  creatorAvatar?: string;
}

export function MarketCard({
  id,
  title,
  options,
  volume,
  icon,
  hasChanceIndicator = false,
  chanceValue,
  hasLargeButtons = false,
  creatorName,
  creatorAvatar
}: MarketCardProps) {
  const mainChance = chanceValue ?? options[0]?.probability ?? 0;

  return (
    <Link to={`/market/${id}`} className="block h-full">
      <div
        className="
        relative h-full flex flex-col
        rounded-xl
        border border-border/50
        bg-background/80
        backdrop-blur
        p-4
        hover:bg-background/90
        transition
    "
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <span className="text-xl">{icon}</span>
            </div>
          )}

          <h3
            className={cn(
              "text-sm font-medium leading-snug text-foreground line-clamp-2",
              hasChanceIndicator && "pr-16"
            )}
          >
            {title}
          </h3>

          {/* Chance badge */}
          {hasChanceIndicator && (
            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-secondary text-foreground shrink-0">
              <span className="text-xs font-semibold">{mainChance}%</span>
              <span className="text-[10px] text-muted-foreground leading-none">
                chance
              </span>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="flex-1 space-y-2 mb-4">
          {hasLargeButtons ? (
            <div className="flex gap-2 mt-auto">
              <Button className="flex-1 h-10 rounded-md bg-green-500/90 hover:bg-green-500 text-white text-sm font-medium transition">
                Yes
              </Button>
              <Button className=" flex-1 h-10 rounded-md bg-red-500/90 hover:bg-red-500 text-white text-sm font-medium transition">
                No
              </Button>
            </div>
          ) : (
            options.slice(0, 2).map((option, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-sm text-muted-foreground truncate">
                  {option.label}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-foreground">
                    {option.probability}%
                  </span>

                  <Button className="px-2 py-1 rounded-md bg-green-500/20 text-green-500 text-xs font-medium hover:bg-green-500/30 transition">
                    Yes
                  </Button>

                  <Button className="px-2 py-1 rounded-md bg-red-500/20 text-red-500 text-xs font-medium hover:bg-red-500/30 transition">
                    No
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="
        mt-auto pt-3
        border-t border-border/50
        flex items-center justify-between
        text-xs text-muted-foreground
      "
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">${volume} Vol.</span>

            {creatorName && (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-secondary overflow-hidden">
                  {creatorAvatar ? (
                    <img
                      src={creatorAvatar}
                      alt={creatorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] flex items-center justify-center h-full">
                      👤
                    </span>
                  )}
                </div>
                <span>{creatorName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              className="p-1 rounded hover:bg-secondary transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              className="p-1 rounded hover:bg-secondary transition"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
