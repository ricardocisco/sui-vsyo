import { useUserPositions } from "../hooks/useUserPositions";
import { useSellPosition } from "../hooks/useSellPosition";
import { useClaimWinnings } from "../hooks/useClaimWinnings";
import { Button } from "./ui/button";
import { Loader2, Coins, Trophy, Ban } from "lucide-react";

const DECIMAL_FACTOR = 1_000_000;

interface UserPositionsProps {
  marketId: string;
  isResolved: boolean;
  winningOutcome: boolean | null; // true = YES, false = NO, null = Not resolved
}

export function UserPositions({
  marketId,
  isResolved,
  winningOutcome
}: UserPositionsProps) {
  // 1. Busca todas as posições do usuário
  const { data: positions, isPending } = useUserPositions();
  const { sellPosition } = useSellPosition();
  const { claimWinnings } = useClaimWinnings();

  if (isPending) return <Loader2 className="animate-spin" />;

  // 2. Filtra apenas as posições DESTE mercado
  const myMarketPositions =
    positions?.filter((p: any) => p.market_id === marketId) || [];

  if (myMarketPositions.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>Você ainda não tem posição neste mercado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {myMarketPositions.map((pos: any) => {
        const shares = Number(pos.shares);
        const valueUSD = (shares / DECIMAL_FACTOR).toFixed(2);
        const isYes = pos.is_yes;

        // Verifica se é vencedor
        const isWinner = isResolved && winningOutcome === isYes;
        const isLoser = isResolved && winningOutcome !== isYes;

        return (
          <div
            key={pos.id.id}
            className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50"
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${
                    isYes ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isYes ? "SIM (YES)" : "NÃO (NO)"}
                </span>
                <span className="text-xs bg-background px-2 py-0.5 rounded text-muted-foreground">
                  {pos.shares} shares
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Valor Atual: ${valueUSD}
              </div>
            </div>

            {/* AÇÕES */}
            <div>
              {!isResolved && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sellPosition(marketId, pos.id.id)}
                  className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                >
                  <Coins className="w-3 h-3 mr-1" /> Vender
                </Button>
              )}

              {isResolved && isWinner && (
                <Button
                  size="sm"
                  onClick={() => claimWinnings(marketId, pos.id.id)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Trophy className="w-3 h-3 mr-1" /> Resgatar Prêmios
                </Button>
              )}

              {isResolved && isLoser && (
                <span className="flex items-center text-xs text-red-500 font-semibold px-3 py-2 bg-red-500/10 rounded-md">
                  <Ban className="w-3 h-3 mr-1" /> Perdeu
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
