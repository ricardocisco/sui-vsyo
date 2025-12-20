/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  History,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

import {
  useCurrentAccount,
  ConnectButton,
  useSuiClientQuery
} from "@mysten/dapp-kit";
import { useUserPositions } from "../hooks/useUserPositions";
import { USDC_TYPE, PACKAGE_ID, MODULE_NAME } from "../constants";

const DECIMAL_FACTOR = 1_000_000;

interface ProcessedPortfolio {
  openPositions: any[];
  inPositions: number;
  totalPnL: number;
  totalPnLPercent: number;
}

export default function Portfolio() {
  const account = useCurrentAccount();
  const [activeTab, setActiveTab] = useState<"open" | "closed" | "history">(
    "open"
  );

  // 1. Buscar Saldo USDC Disponível
  const { data: balanceData } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address || "",
      coinType: USDC_TYPE
    },
    { enabled: !!account }
  );

  const availableBalance =
    Number(balanceData?.totalBalance || 0) / DECIMAL_FACTOR;

  // 2. Buscar Posições (Tickets) do Usuário
  const { data: positions, isPending: isLoadingPositions } = useUserPositions();

  // 3. Buscar Detalhes dos Mercados dessas Posições (Para calcular preço atual)
  // Extraímos os IDs únicos dos mercados que o usuário está participando
  const uniqueMarketIds = Array.from(
    new Set(positions?.map((p: any) => p.market_id) || [])
  );

  const { data: marketsData } = useSuiClientQuery(
    "multiGetObjects",
    {
      ids: uniqueMarketIds,
      options: { showContent: true }
    },
    {
      enabled: uniqueMarketIds.length > 0
    }
  );

  // 4. Buscar Histórico de Eventos (Compra/Venda/Claim)
  // Obs: Isso busca eventos globais e filtra no front. Para escalar, precisaria de um Indexer.
  const { data: eventsData } = useSuiClientQuery(
    "queryEvents",
    {
      query: { MoveModule: { package: PACKAGE_ID, module: MODULE_NAME } },
      order: "descending",
      limit: 50
    },
    { enabled: !!account }
  );

  const processedPortfolio: ProcessedPortfolio = useMemo(() => {
    if (!positions || !marketsData) {
      return {
        openPositions: [],
        inPositions: 0,
        totalPnL: 0,
        totalPnLPercent: 0
      };
    }

    let totalPositionValue = 0;
    let totalCostBasis = 0;

    // Mapa auxiliar para acessar dados do mercado rápido
    const marketMap = new Map();
    marketsData.forEach((m) => {
      if (m.data?.content?.dataType === "moveObject") {
        marketMap.set(m.data.objectId, m.data.content.fields as any);
      }
    });

    const detailedPositions = positions
      .map((pos: any) => {
        const market = marketMap.get(pos.market_id);
        if (!market) return null;

        const shares = Number(pos.shares);
        const cost = Number(pos.cost_basis || 0); // O contrato precisa ter gravado isso

        // Cálculo do Preço Atual Baseado na Probabilidade
        const yesSold = Number(market.yes_shares_sold);
        const noSold = Number(market.no_shares_sold);
        const totalSold = yesSold + noSold;

        // Se total for 0, preço é 0.5. Senão, calcula proporção.
        let probability = 0.5;
        if (totalSold > 0) {
          probability = pos.is_yes ? yesSold / totalSold : noSold / totalSold;
        }

        // Valor Atual = Shares * Probabilidade (1 Share vale 1 USDC se ganhar, então vale Probabilidade * 1 agora)
        // Ajustando decimais: O valor "bruto" em cents seria shares * probability.
        const currentValueRaw = shares * probability;

        totalPositionValue += currentValueRaw;
        totalCostBasis += cost;

        const pnlRaw = currentValueRaw - cost;
        const pnlPercent = cost > 0 ? (pnlRaw / cost) * 100 : 0;

        return {
          id: pos.id.id,
          marketId: pos.market_id,
          title: market.description, // Descrição do mercado
          outcome: pos.is_yes ? "SIM" : "NÃO",
          quantity: shares / DECIMAL_FACTOR,
          avgPrice: cost / shares, // Custo por share
          currentPrice: probability,
          pnl: pnlRaw / DECIMAL_FACTOR,
          pnlPercentage: pnlPercent,
          deadline: Number(market.deadline),
          resolved: market.resolved
        };
      })
      .filter(Boolean); // Remove nulos

    const totalPnL = (totalPositionValue - totalCostBasis) / DECIMAL_FACTOR;
    const totalCostUSD = totalCostBasis / DECIMAL_FACTOR;
    const totalPnLPercent =
      totalCostUSD > 0 ? (totalPnL / totalCostUSD) * 100 : 0;

    return {
      openPositions: detailedPositions,
      inPositions: totalPositionValue / DECIMAL_FACTOR,
      totalPnL,
      totalPnLPercent
    };
  }, [positions, marketsData]);

  // --- PROCESSAMENTO DO HISTÓRICO ---
  const myHistory = useMemo(() => {
    if (!eventsData?.data || !account) return [];

    return eventsData.data
      .filter((ev: any) => ev.parsedJson?.user === account.address) // Filtra APENAS meus eventos
      .map((ev: any) => {
        const typeStr = ev.type.split("::").pop(); // Pega "PositionBought", "WinningsClaimed" etc
        const date = new Date(Number(ev.timestampMs)).toLocaleDateString();
        const json = ev.parsedJson;

        let typeLabel = "Transação";
        let amount = 0;
        let isPositive = false;

        if (typeStr === "PositionBought") {
          typeLabel = "Compra";
          amount = Number(json.cost) / DECIMAL_FACTOR;
          isPositive = false; // Saiu dinheiro
        } else if (typeStr === "PositionSold") {
          typeLabel = "Venda";
          amount = Number(json.payout) / DECIMAL_FACTOR;
          isPositive = true; // Entrou dinheiro
        } else if (typeStr === "WinningsClaimed") {
          typeLabel = "Prêmio";
          amount = Number(json.amount) / DECIMAL_FACTOR;
          isPositive = true;
        }

        return {
          type: typeLabel,
          marketId: json.market_id,
          amount,
          isPositive,
          date,
          hash: ev.id.txDigest
        };
      });
  }, [eventsData, account]);

  const totalBalance = availableBalance + processedPortfolio.inPositions;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="py-8 flex-1 flex flex-col">
        {!account ? (
          <main className="py-16 flex-1 flex flex-col items-center justify-center">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Conecte sua Carteira</h1>
              <p className="text-muted-foreground mb-8">
                Conecte sua carteira para visualizar seu portfólio real na
                blockchain Sui.
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </main>
        ) : (
          <div className="container mx-auto px-4">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Meu Portfólio</h1>
            </div>

            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
              {/* CARD 1: SALDO TOTAL */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">Valor Patrimonial</span>
                </div>
                <div className="text-3xl font-bold font-mono">
                  $
                  {totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>

              {/* CARD 2: PnL TOTAL */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  {processedPortfolio.totalPnL >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm">Lucro/Prejuízo (Aberto)</span>
                </div>
                <div
                  className={cn(
                    "text-3xl font-bold font-mono",
                    processedPortfolio.totalPnL >= 0
                      ? "text-green-500"
                      : "text-destructive"
                  )}
                >
                  {processedPortfolio.totalPnL >= 0 ? "+" : ""}$
                  {processedPortfolio.totalPnL.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    processedPortfolio.totalPnLPercent >= 0
                      ? "text-green-500"
                      : "text-destructive"
                  )}
                >
                  {processedPortfolio.totalPnLPercent >= 0 ? "+" : ""}
                  {processedPortfolio.totalPnLPercent.toFixed(1)}%
                </span>
              </div>

              {/* CARD 3: EM POSIÇÕES */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">Em Apostas Ativas</span>
                </div>
                <div className="text-3xl font-bold font-mono">
                  $
                  {processedPortfolio.inPositions.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>

              {/* CARD 4: DISPONÍVEL */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <ArrowUpRight className="w-4 h-4 text-primary" />
                  <span className="text-sm">USDC Disponível</span>
                </div>
                <div className="text-3xl font-bold font-mono">
                  $
                  {availableBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-lg w-fit mb-6">
              <button
                onClick={() => setActiveTab("open")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ",
                  activeTab === "open"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Briefcase className="w-4 h-4" />
                Posições Abertas
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  " flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === "history"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <History className="w-4 h-4" />
                Histórico
              </button>
            </div>

            {/* Tab Content: OPEN POSITIONS */}
            {activeTab === "open" && (
              <div className="space-y-2">
                {isLoadingPositions ? (
                  <div className="p-10 text-center text-muted-foreground flex justify-center gap-2">
                    <Loader2 className="animate-spin" /> Carregando posições...
                  </div>
                ) : processedPortfolio.openPositions.length === 0 ? (
                  <div className="p-10 text-center border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">
                      Você não possui posições abertas.
                    </p>
                    <Link to="/">
                      <Button variant="link">Explorar Mercados</Button>
                    </Link>
                  </div>
                ) : (
                  processedPortfolio.openPositions.map((pos: any) => (
                    <Link
                      key={pos.id}
                      to={`/market/${pos.marketId}`}
                      className="block glass rounded-xl p-2 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={cn(
                                "stat-pill px-1 rounded-sm font-semibold",
                                pos.outcome === "SIM"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-destructive/20 text-destructive"
                              )}
                            >
                              {pos.outcome}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(pos.deadline).toLocaleDateString()}
                            </span>
                            {pos.resolved && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-500 px-1 rounded">
                                Resolvido
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {pos.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              Qtd (Shares)
                            </div>
                            <div className="font-mono font-semibold">
                              {pos.quantity.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right hidden sm:block">
                            <div className="text-xs text-muted-foreground">
                              Preço Médio
                            </div>
                            <div className="font-mono">
                              ${pos.avgPrice.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right hidden sm:block">
                            <div className="text-xs text-muted-foreground">
                              Preço Atual
                            </div>
                            <div className="font-mono">
                              ${pos.currentPrice.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <div className="text-xs text-muted-foreground">
                              P&L Estimado
                            </div>
                            <div
                              className={cn(
                                "font-mono font-bold",
                                pos.pnl >= 0
                                  ? "text-green-500"
                                  : "text-destructive"
                              )}
                            >
                              {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
                            </div>
                            <div
                              className={cn(
                                "text-xs",
                                pos.pnlPercentage >= 0
                                  ? "text-green-500"
                                  : "text-destructive"
                              )}
                            >
                              {pos.pnlPercentage >= 0 ? "+" : ""}
                              {pos.pnlPercentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Tab Content: HISTORY */}
            {activeTab === "history" && (
              <div className="glass rounded-xl overflow-hidden">
                {myHistory.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhuma transação encontrada.
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Tipo
                        </th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                          Valor
                        </th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                          Data
                        </th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                          Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {myHistory.map((tx: any, index: number) => (
                        <tr
                          key={index}
                          className="border-b border-border/50 last:border-0 hover:bg-secondary/20"
                        >
                          <td className="p-4">
                            <span
                              className={cn(
                                "stat-pill w-fit flex items-center gap-2 px-2 rounded-sm",
                                tx.isPositive
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-destructive/20 text-destructive"
                              )}
                            >
                              {tx.isPositive ? (
                                <ArrowDownRight className="w-3 h-3" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3" />
                              )}
                              {tx.type}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono">
                            <span
                              className={
                                tx.isPositive
                                  ? "text-green-500"
                                  : "text-foreground"
                              }
                            >
                              {tx.isPositive ? "+" : "-"}${tx.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-4 text-right text-sm text-muted-foreground">
                            {tx.date}
                          </td>
                          <td className="p-4 text-right">
                            <a
                              href={`https://suiscan.xyz/testnet/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                            >
                              Explorer
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
