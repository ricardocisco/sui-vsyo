import { Link } from "react-router-dom";
import { ArrowRight, Flame, Clock, Users, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

interface FeaturedMarketProps {
  id: string;
  title: string;
  description: string;
  yesPrice: number;
  volume: string;
  traders: number;
  endDate: string;
  imageUrl?: string;
}

export function FeaturedMarket({
  id,
  title,
  description,
  yesPrice,
  volume,
  traders,
  endDate
}: FeaturedMarketProps) {
  const yesPercentage = Math.round(yesPrice * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl glass border border-primary/20 glow-primary">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-cyan-500/5" />

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="stat-pill bg-warning/20 text-warning">
                <Flame className="w-3 h-3" />
                Mercado em Destaque
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
              {title}
            </h2>

            <p className="text-muted-foreground mb-6 max-w-xl">{description}</p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div>
                  <div className="font-mono font-bold text-foreground">
                    ${volume}
                  </div>
                  <div className="text-xs text-muted-foreground">Volume</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">
                    {traders.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Traders</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{endDate}</div>
                  <div className="text-xs text-muted-foreground">Resolução</div>
                </div>
              </div>
            </div>

            <Button size="lg" asChild>
              <Link to={`/market/${id}`}>
                Negociar Agora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Probability Display */}
          <div className="lg:w-64 shrink-0">
            <div className="p-6 rounded-xl bg-background/50 border border-border/50 text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Probabilidade SIM
              </div>
              <div className="relative mb-4">
                <div className="text-5xl font-bold gradient-text">
                  {yesPercentage}%
                </div>
                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl -z-10" />
              </div>

              {/* Mini probability bar */}
              <div className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-linear-to-r from-success to-success/70 rounded-full transition-all duration-500"
                  style={{ width: `${yesPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>SIM: ${yesPrice.toFixed(2)}</span>
                <span>NÃO: ${(1 - yesPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
