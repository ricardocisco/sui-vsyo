import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { mockMarkets } from "../lib/mockMarkets";
import {
  ArrowLeft,
  Clock,
  Users,
  TrendingUp,
  ExternalLink,
  Info,
  Wallet,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

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

// Mock chart data
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
  const market = mockMarkets.find((m) => m.id === id);

  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const [timeFilter, setTimeFilter] = useState("1M");
  const [isConnected] = useState(true);

  if (!market) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Mercado não encontrado</h1>
          <Button asChild>
            <Link to="/">Voltar para Mercados</Link>
          </Button>
        </div>
      </div>
    );
  }

  const chartData = generateChartData(market.yesPrice);
  const yesPercentage = Math.round(market.yesPrice * 100);
  const noPercentage = Math.round(market.noPrice * 100);

  const currentPrice =
    selectedOutcome === "yes" ? market.yesPrice : market.noPrice;
  const estimatedReturn = amount
    ? (Number(amount) / currentPrice).toFixed(2)
    : "0.00";
  const potentialProfit = amount
    ? (Number(amount) / currentPrice - Number(amount)).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-8">
        <div className="mx-auto px-4 container">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Mercados
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Market Header */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="stat-pill bg-secondary text-muted-foreground mb-3">
                      {market.category}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
                      {market.title}
                    </h1>
                  </div>
                  <div className="shrink-0">
                    <div className="stat-pill bg-success/20 text-success">
                      <CheckCircle className="w-3 h-3" />
                      Ativo
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  {market.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">Volume</span>
                    </div>
                    <div className="font-mono font-bold text-lg">
                      ${market.volume}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Traders</span>
                    </div>
                    <div className="font-bold text-lg">
                      {market.traders.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Resolução</span>
                    </div>
                    <div className="font-bold text-lg">{market.endDate}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Info className="w-4 h-4" />
                      <span className="text-xs">Rede</span>
                    </div>
                    <div className="font-bold text-lg">Polygon</div>
                  </div>
                </div>
              </div>

              {/* Price Chart */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Histórico de Preços</h2>
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

                <div className="h-[300px]">
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
                          fill: "hsl(var(--muted-foreground))",
                          fontSize: 12
                        }}
                      />
                      <YAxis
                        domain={[0, 1]}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "hsl(var(--muted-foreground))",
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
              </div>

              {/* Resolution Details */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Regras de Resolução
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    Este mercado será resolvido como{" "}
                    <strong className="text-success">SIM</strong> se o evento
                    descrito ocorrer antes da data de resolução indicada.
                  </p>
                  <p>
                    A resolução será baseada em fontes oficiais verificáveis. Em
                    caso de ambiguidade, a decisão será tomada pelo comitê de
                    governança.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Ver fonte de dados
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Trading Panel */}
            <div className="space-y-6">
              {/* Probability Display */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-sm text-muted-foreground mb-4">
                  Probabilidades Atuais
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => setSelectedOutcome("yes")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-center",
                      selectedOutcome === "yes"
                        ? "border-green-500 bg-green-500/10 glow-green-500"
                        : "border-border hover:border-green-500/50"
                    )}
                  >
                    <CheckCircle
                      className={cn(
                        "w-6 h-6 mx-auto mb-2",
                        selectedOutcome === "yes"
                          ? "text-green-500"
                          : "text-muted-foreground"
                      )}
                    />
                    <div className="text-2xl font-bold text-green-500">
                      {yesPercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      SIM
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      ${market.yesPrice.toFixed(2)}
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedOutcome("no")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-center",
                      selectedOutcome === "no"
                        ? "border-destructive bg-destructive/10 glow-destructive"
                        : "border-border hover:border-destructive/50"
                    )}
                  >
                    <XCircle
                      className={cn(
                        "w-6 h-6 mx-auto mb-2",
                        selectedOutcome === "no"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      )}
                    />
                    <div className="text-2xl font-bold text-destructive">
                      {noPercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      NÃO
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      ${market.noPrice.toFixed(2)}
                    </div>
                  </button>
                </div>

                {/* Probability Bar */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-green-500 to-green-500/70 rounded-full transition-all duration-500"
                    style={{ width: `${yesPercentage}%` }}
                  />
                </div>
              </div>

              {/* Trade Form */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4">
                  Comprar {selectedOutcome === "yes" ? "SIM" : "NÃO"}
                </h3>

                {isConnected ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          Valor (USDC)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-7 text-lg font-mono"
                          />
                        </div>
                        <div className="flex gap-2 mt-2">
                          {["10", "50", "100", "500"].map((val) => (
                            <button
                              key={val}
                              onClick={() => setAmount(val)}
                              className="flex-1 py-1.5 text-xs rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                              ${val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Calculation Summary */}
                      <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Preço por contrato
                          </span>
                          <span className="font-mono">
                            ${currentPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Contratos
                          </span>
                          <span className="font-mono">{estimatedReturn}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Retorno potencial
                          </span>
                          <span className="font-mono text-success">
                            +${potentialProfit}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Retorno Total</span>
                            <span className="font-mono font-bold text-success">
                              ${estimatedReturn}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fees Notice */}
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 text-warning text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          Taxa de protocolo: 2% • Taxa de rede: ~$0.01
                        </span>
                      </div>

                      <Button
                        size="lg"
                        className="w-full"
                        disabled={!amount || Number(amount) <= 0}
                      >
                        Comprar {selectedOutcome === "yes" ? "SIM" : "NÃO"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Conecte sua carteira para negociar
                    </p>
                    <Button className="w-full">
                      <Wallet className="w-4 h-4" />
                      Conectar Carteira
                    </Button>
                  </div>
                )}
              </div>

              {/* My Position */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4">Minha Posição</h3>
                <div className="text-center py-6 text-muted-foreground">
                  <p>Você ainda não tem posição neste mercado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
