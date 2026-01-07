import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Wallet, CheckCircle, XCircle, Loader2 } from "lucide-react";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { Input } from "../components/ui/input";
import { Footer } from "../components/Footer";

// Hooks Reais
import { useGetMarket } from "../hooks/useGetMarket";
import { useBuyYes } from "../hooks/useBuyYes";
import { useBuyNo } from "../hooks/useBuyNo";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { AdminMarketControls } from "../components/AdminMarketControls";
import { UserPositions } from "../components/UserPositions";

// Constantes de conversão
const COIN_DECIMALS = 6;
const DECIMAL_FACTOR = Math.pow(10, COIN_DECIMALS); // 1.000.000

// Mock chart data (Isso ainda pode ser mockado visualmente pois não temos histórico on-chain)
const generateChartData = (basePrice: number) => {
  const data = [];
  let price = basePrice - 0.15;
  for (let i = 30; i >= 0; i--) {
    const volatility = (Math.random() - 0.5) * 0.05;
    price = Math.max(0.01, Math.min(0.99, price + volatility + 0.004));
    data.push({
      date: `${i}d`,
      price: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000) + 10000
    });
  }
  return data.reverse();
};

const timeFilters = ["1H", "1D", "1S", "1M", "ALL"];

export default function MarketDetail() {
  const { id } = useParams();
  const account = useCurrentAccount();

  // 1. Busca dados reais
  const { data: market, isPending, error } = useGetMarket(id || "");
  const { buyYes } = useBuyYes();
  const { buyNo } = useBuyNo();

  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const [timeFilter, setTimeFilter] = useState("1M");
  const [isBuying, setIsBuying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detecta o tema atual
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme();

    // Observa mudanças no tema
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  // Estados de Loading
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container py-16 text-center flex-1">
          <h1 className="text-2xl font-bold mb-4">Mercado não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O ID fornecido não existe na blockchain.
          </p>
          <Button asChild>
            <Link to="/">Voltar para Mercados</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 2. Cálculos com dados reais
  const yesShares = Number(market.yes_shares_sold);
  const noShares = Number(market.no_shares_sold);
  const totalShares = yesShares + noShares;

  // Probabilidade (0-100)
  const yesProb =
    totalShares === 0 ? 50 : Math.round((yesShares / totalShares) * 100);
  const noProb = 100 - yesProb;

  // Preço estimado (Probabilidade / 100)
  const yesPrice = yesProb / 100;
  const noPrice = noProb / 100;

  // Formatação de Volume
  const volumeUSD = (
    Number(market.total_funds) / DECIMAL_FACTOR
  ).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });

  const chartData = generateChartData(yesPrice);

  // Cálculos de Retorno baseado em AMM (Automated Market Maker)
  // O contrato atual tem um BUG: não divide o pool proporcionalmente entre os vencedores
  //
  // Em um AMM real de mercado de predição:
  // - Quando você compra shares, o preço muda dinamicamente (mais compras = preço sobe)
  // - Quando o mercado resolve, os vencedores dividem o pool TOTAL proporcionalmente
  // - Cada vencedor recebe: (suas_shares / total_winning_shares) * pool_total
  //
  // Cálculo correto do "To Win":
  // - Você investe: amountNum USDC
  // - Você recebe: sharesBought = amountNum * DECIMAL_FACTOR (unidades mínimas)
  // - Pool total atual: market.total_funds (em unidades mínimas)
  // - Total de shares da opção escolhida: selectedOutcome === "yes" ? yesShares : noShares
  // - Após sua compra: newTotalShares = totalShares + sharesBought
  // - Sua proporção: sharesBought / newTotalShares
  // - Quando resolve, você recebe: sua_proporção * pool_total_futuro
  // - Lucro = você_recebe - você_investiu
  const calculatePotentialProfit = () => {
    if (!amount || Number(amount) <= 0) return "0.00";

    const amountNum = Number(amount);
    const sharesBought = amountNum * DECIMAL_FACTOR; // Unidades mínimas

    // Pool total atual (em unidades mínimas)
    const currentPool = Number(market.total_funds);

    // Total de shares da opção escolhida
    const currentWinningShares =
      selectedOutcome === "yes" ? yesShares : noShares;

    // Após sua compra
    const newWinningShares = currentWinningShares + sharesBought;
    const newPool = currentPool + sharesBought; // Você adiciona ao pool

    // Se não há outras shares da opção escolhida, você recebe tudo
    if (newWinningShares === 0) {
      return "0.00";
    }

    // Sua proporção do pool quando resolve
    const yourProportion = sharesBought / newWinningShares;

    // Quando resolve, você recebe sua proporção do pool total
    // O pool total será: newPool (todos os fundos no mercado)
    const yourWinnings = newPool * yourProportion;

    // Lucro = o que você recebe - o que você investiu
    const profit = yourWinnings / DECIMAL_FACTOR - amountNum;

    // Formatação do resultado
    if (profit <= 0) {
      return "0.00";
    }

    // Se o lucro for muito alto, formatar de forma mais legível
    if (profit >= 1000000) {
      return `+$${(profit / 1000000).toFixed(2)}M`;
    } else if (profit >= 1000) {
      return `+$${(profit / 1000).toFixed(1)}k`;
    }

    return `+$${profit.toFixed(2)}`;
  };

  const potentialProfit = calculatePotentialProfit();

  // 3. Handler de Compra Real
  const handleTrade = () => {
    if (!amount || Number(amount) <= 0 || !id) return;

    setIsBuying(true);

    // Converte USD input para Shares (Cents)
    const sharesToBuy = Math.floor(Number(amount) * DECIMAL_FACTOR);

    if (selectedOutcome === "yes") {
      buyYes(id, sharesToBuy);
    } else {
      buyNo(id, sharesToBuy);
    }

    // Reset loading visual após um tempo
    setTimeout(() => setIsBuying(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="py-4 flex-1 flex flex-col mx-auto container p-4">
        <div className="mx-auto px-2 container">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Mercados
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Market Header - Simplified */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    {market.market_type && (
                      <span className="inline-block bg-secondary text-muted-foreground text-xs px-2 py-1 rounded mb-2">
                        {market.market_type}
                      </span>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {market.description}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {volumeUSD} Vol.
                      </span>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-xs px-2 py-1 rounded",
                          market.resolved
                            ? "bg-red-500/20 text-red-500"
                            : "bg-green-500/20 text-green-500"
                        )}
                      >
                        {market.resolved ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {market.resolved ? "Resolvido" : "Ativo"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Chart - Larger and more prominent */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Histórico</h2>
                  <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
                    {timeFilters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setTimeFilter(filter)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                          timeFilter === filter
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorPrice"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(217, 91%, 60%)"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(217, 91%, 60%)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: isDarkMode
                            ? "rgb(209, 213, 219)"
                            : "rgb(107, 114, 128)",
                          fontSize: 12
                        }}
                      />
                      <YAxis
                        domain={[0, 1]}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: isDarkMode
                            ? "rgb(209, 213, 219)"
                            : "rgb(107, 114, 128)",
                          fontSize: 12
                        }}
                        tickFormatter={(value) =>
                          `${(value * 100).toFixed(0)}%`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        formatter={(value: number) => [
                          `${(value * 100).toFixed(1)}%`,
                          "Preço SIM"
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(217, 91%, 60%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Admin Controls - Hidden by default, can be shown on hover or in a menu */}
                {market && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <AdminMarketControls
                      marketId={market.id}
                      isResolved={market.resolved}
                      deadline={market.deadline}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Trading Panel - Simplified like Polymarket */}
            <div className="space-y-4">
              {/* Probability Display - Integrated with trading */}
              <div className="glass rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setSelectedOutcome("yes")}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-center",
                      selectedOutcome === "yes"
                        ? "border-green-500 bg-green-500/10"
                        : "border-border hover:border-green-500/50"
                    )}
                  >
                    <div className="text-3xl font-bold text-green-500 mb-1">
                      {yesProb}%
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      SIM
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ${yesPrice.toFixed(2)}
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedOutcome("no")}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-center",
                      selectedOutcome === "no"
                        ? "border-red-500 bg-red-500/10"
                        : "border-border hover:border-red-500/50"
                    )}
                  >
                    <div className="text-3xl font-bold text-red-500 mb-1">
                      {noProb}%
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      NÃO
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ${noPrice.toFixed(2)}
                    </div>
                  </button>
                </div>

                <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${yesProb}%` }}
                  />
                </div>

                {/* Trade Form - Simplified */}
                {account ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        Valor
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-7"
                        />
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        {["10", "50", "100"].map((val) => (
                          <button
                            key={val}
                            onClick={() => setAmount(val)}
                            className="flex-1 py-1.5 text-xs rounded bg-secondary hover:bg-secondary/80 transition-colors"
                          >
                            ${val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-mono">${amount || "0.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">To Win</span>
                        <span className="font-mono text-green-500">
                          {potentialProfit}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleTrade}
                      disabled={
                        !amount ||
                        Number(amount) <= 0 ||
                        isBuying ||
                        market.resolved
                      }
                    >
                      {isBuying ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        `Comprar ${selectedOutcome === "yes" ? "SIM" : "NÃO"}`
                      )}
                    </Button>
                    {market.resolved && (
                      <p className="text-center text-red-500 text-xs">
                        Mercado já resolvido.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Wallet className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Conecte sua carteira para negociar
                    </p>
                    <ConnectButton />
                  </div>
                )}
              </div>

              {/* User Positions - Collapsible or smaller */}
              {account && (
                <div className="glass rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-3">Minha Posição</h3>
                  <UserPositions
                    marketId={id || ""}
                    isResolved={market?.resolved || false}
                    winningOutcome={market?.outcome?.fields?.val ?? null}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
