import { Link } from "react-router-dom";
import { Loader2, DollarSign } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useGetMarket } from "../hooks/useGetMarket";
import { useBuyYes } from "../hooks/useBuyYes";
import { useBuyNo } from "../hooks/useBuyNo";
import { useState } from "react";

const COIN_DECIMALS = 6;
const DECIMAL_FACTOR = Math.pow(10, COIN_DECIMALS);

interface MarketCardProps {
  id: string;
  icon?: string;
  hasChanceIndicator?: boolean;
  hasLargeButtons?: boolean;
}

export function MarketCard({
  id,
  icon = "🔮",
  hasChanceIndicator = false,
  hasLargeButtons = false
}: MarketCardProps) {
  const { data: market, isPending } = useGetMarket(id);
  const { buyYes } = useBuyYes();
  const { buyNo } = useBuyNo();

  const [isBuying, setIsBuying] = useState(false);

  // NOVO: Estado para guardar o valor da aposta em Dólares (Padrão $5)
  const [wager, setWager] = useState<string>("5");

  if (isPending || !market) {
    return (
      <div className="h-full rounded-xl border border-border/50 bg-background/50 p-4 flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const yesShares = Number(market.yes_shares_sold);
  const noShares = Number(market.no_shares_sold);
  const totalShares = yesShares + noShares;
  const yesProb =
    totalShares === 0 ? 50 : Math.round((yesShares / totalShares) * 100);
  const noProb = 100 - yesProb;
  const volumeRaw = Number(market.total_funds);
  const volumeUSD = (volumeRaw / DECIMAL_FACTOR).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });

  const handleQuickBuy = (e: React.MouseEvent, isYes: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    if (!wager || Number(wager) <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }

    setIsBuying(true);

    // CONVERSÃO: O input é em Dólares, o contrato usa Cents (Shares)
    // 1 USD = 100 Shares
    const amountInShares = Math.floor(Number(wager) * DECIMAL_FACTOR);

    console.log(`Comprando: ${wager} USD -> ${amountInShares} raw units`);

    if (isYes) buyYes(id, amountInShares);
    else buyNo(id, amountInShares);

    setTimeout(() => setIsBuying(false), 2000);
  };

  // Handler para evitar que clicar no Input abra a página
  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link to={`/market/${id}`} className="block h-full group">
      <div
        className="
        relative h-full flex flex-col
        rounded-xl
        border border-border/50
        bg-background/80
        backdrop-blur
        p-4
        hover:bg-background/90
        hover:border-border/80
        transition-all duration-200
    "
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 text-xl border border-border/50">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-sm font-medium leading-snug text-foreground line-clamp-2",
                hasChanceIndicator && "pr-12"
              )}
            >
              {market.description}
            </h3>
          </div>
          {hasChanceIndicator && (
            <div className="absolute top-4 right-4 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-secondary text-foreground shrink-0 border border-border/50">
              <span className="text-xs font-bold text-primary">{yesProb}%</span>
              <span className="text-[9px] text-muted-foreground leading-none uppercase tracking-tighter">
                Yes
              </span>
            </div>
          )}
        </div>

        {/* ÁREA DE AÇÃO */}
        <div className="flex-1 flex flex-col justify-end space-y-3 mb-4">
          {/* NOVO: Input de Valor de Aposta */}
          <div
            className="flex items-center gap-2 bg-secondary/30 p-1.5 rounded-md border border-border/50"
            onClick={handleInputClick} // Impede navegação ao clicar no container
          >
            <DollarSign className="w-4 h-4 text-muted-foreground ml-1" />
            <input
              type="number"
              min="1"
              value={wager}
              onChange={(e) => setWager(e.target.value)}
              onClick={handleInputClick} // Impede navegação ao clicar no input
              className="bg-transparent border-none text-sm w-full focus:outline-none text-foreground placeholder:text-muted-foreground/50"
              placeholder="Valor (USD)"
            />
            <span className="text-[10px] text-muted-foreground whitespace-nowrap pr-2">
              USDC
            </span>
          </div>

          {hasLargeButtons ? (
            <div className="flex gap-2">
              <Button
                onClick={(e) => handleQuickBuy(e, true)}
                disabled={market.resolved || isBuying}
                className="flex-1 h-9 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 text-sm font-medium transition"
              >
                Yes {yesProb}%
              </Button>
              <Button
                onClick={(e) => handleQuickBuy(e, false)}
                disabled={market.resolved || isBuying}
                className="flex-1 h-9 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-sm font-medium transition"
              >
                No {noProb}%
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Linha YES */}
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">Yes</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-500">
                    {yesProb}%
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-500"
                    onClick={(e) => handleQuickBuy(e, true)}
                  >
                    Buy
                  </Button>
                </div>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${yesProb}%` }}
                />
              </div>

              {/* Linha NO */}
              <div className="flex items-center justify-between gap-2 text-sm mt-1">
                <span className="text-muted-foreground">No</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-500">{noProb}%</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-rose-500/30 hover:bg-rose-500/10 text-rose-500"
                    onClick={(e) => handleQuickBuy(e, false)}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">
              {volumeUSD} Vol.
            </span>
            {market.resolved && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] border ${
                  market.outcome?.fields.val
                    ? "border-emerald-500 text-emerald-500"
                    : "border-rose-500 text-rose-500"
                }`}
              >
                {market.outcome?.fields.val ? "WON: YES" : "WON: NO"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Botões de Bookmark/Refresh (Opcionais) */}
          </div>
        </div>
      </div>
    </Link>
  );
}
