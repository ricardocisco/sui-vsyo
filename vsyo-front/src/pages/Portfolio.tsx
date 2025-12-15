import { useState } from "react";
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
  Briefcase
} from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

// Mock portfolio data
const portfolioData = {
  totalBalance: 2450.0,
  totalPnL: 324.5,
  totalPnLPercentage: 15.3,
  available: 1200.0,
  inPositions: 1250.0
};

const openPositions = [
  {
    id: "bitcoin-100k-2025",
    title: "Bitcoin atingirá $100K antes de março de 2025?",
    outcome: "yes" as const,
    quantity: 150,
    avgPrice: 0.55,
    currentPrice: 0.67,
    pnl: 18.0,
    pnlPercentage: 21.8,
    endDate: "Mar 2025"
  },
  {
    id: "trump-2024",
    title: "Trump vencerá as eleições presidenciais de 2024?",
    outcome: "no" as const,
    quantity: 100,
    avgPrice: 0.52,
    currentPrice: 0.48,
    pnl: -4.0,
    pnlPercentage: -7.7,
    endDate: "Nov 2024"
  },
  {
    id: "eth-merge-successful",
    title: "Ethereum terá zero downtime no próximo upgrade?",
    outcome: "yes" as const,
    quantity: 200,
    avgPrice: 0.78,
    currentPrice: 0.85,
    pnl: 14.0,
    pnlPercentage: 8.97,
    endDate: "Fev 2025"
  }
];

const closedPositions = [
  {
    id: "solana-100",
    title: "Solana atingirá $100 em 2024?",
    outcome: "yes" as const,
    result: "won" as const,
    quantity: 80,
    profit: 45.0,
    date: "15 Jan 2024"
  },
  {
    id: "eth-5k",
    title: "ETH atingirá $5K em Q1 2024?",
    outcome: "yes" as const,
    result: "lost" as const,
    quantity: 50,
    profit: -50.0,
    date: "31 Mar 2024"
  }
];

const transactions = [
  {
    type: "buy" as const,
    market: "Bitcoin $100K",
    amount: 82.5,
    date: "Hoje, 14:32",
    hash: "0x1234...5678"
  },
  {
    type: "sell" as const,
    market: "ETH Merge",
    amount: 45.0,
    date: "Ontem, 09:15",
    hash: "0xabcd...efgh"
  },
  {
    type: "deposit" as const,
    amount: 500.0,
    date: "10 Jan 2025",
    hash: "0x9876...4321"
  }
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<"open" | "closed" | "history">(
    "open"
  );
  const [isConnected] = useState(true);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Conecte sua Carteira</h1>
            <p className="text-muted-foreground mb-8">
              Conecte sua carteira para visualizar seu portfólio, posições e
              histórico de transações.
            </p>
            <Button size="lg">
              <Wallet className="w-5 h-5" />
              Conectar Carteira
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Meu Portfólio</h1>
            <p className="text-muted-foreground">
              Acompanhe suas posições, ganhos e histórico de transações.
            </p>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wallet className="w-4 h-4" />
                <span className="text-sm">Saldo Total</span>
              </div>
              <div className="text-3xl font-bold font-mono">
                ${portfolioData.totalBalance.toLocaleString()}
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                {portfolioData.totalPnL >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className="text-sm">Lucro/Prejuízo Total</span>
              </div>
              <div
                className={cn(
                  "text-3xl font-bold font-mono",
                  portfolioData.totalPnL >= 0
                    ? "text-success"
                    : "text-destructive"
                )}
              >
                {portfolioData.totalPnL >= 0 ? "+" : ""}$
                {portfolioData.totalPnL.toLocaleString()}
              </div>
              <span
                className={cn(
                  "text-sm",
                  portfolioData.totalPnLPercentage >= 0
                    ? "text-success"
                    : "text-destructive"
                )}
              >
                {portfolioData.totalPnLPercentage >= 0 ? "+" : ""}
                {portfolioData.totalPnLPercentage}%
              </span>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">Em Posições</span>
              </div>
              <div className="text-3xl font-bold font-mono">
                ${portfolioData.inPositions.toLocaleString()}
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <ArrowUpRight className="w-4 h-4 text-primary" />
                <span className="text-sm">Disponível</span>
              </div>
              <div className="text-3xl font-bold font-mono">
                ${portfolioData.available.toLocaleString()}
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Depositar
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-lg w-fit mb-6">
            <button
              onClick={() => setActiveTab("open")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                activeTab === "open"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Posições Abertas
            </button>
            <button
              onClick={() => setActiveTab("closed")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                activeTab === "closed"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Resolvidos
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                activeTab === "history"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <History className="w-4 h-4 inline mr-2" />
              Histórico
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "open" && (
            <div className="space-y-2">
              {openPositions.map((position) => (
                <Link
                  key={position.id}
                  to={`/market/${position.id}`}
                  className="block glass rounded-xl p-2 hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={cn(
                            "stat-pill",
                            position.outcome === "yes"
                              ? "bg-success/20 text-success"
                              : "bg-destructive/20 text-destructive"
                          )}
                        >
                          {position.outcome === "yes" ? "SIM" : "NÃO"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {position.endDate}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {position.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Quantidade
                        </div>
                        <div className="font-mono font-semibold">
                          {position.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Preço Médio
                        </div>
                        <div className="font-mono">
                          ${position.avgPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Preço Atual
                        </div>
                        <div className="font-mono">
                          ${position.currentPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="text-xs text-muted-foreground">P&L</div>
                        <div
                          className={cn(
                            "font-mono font-bold",
                            position.pnl >= 0
                              ? "text-success"
                              : "text-destructive"
                          )}
                        >
                          {position.pnl >= 0 ? "+" : ""}$
                          {position.pnl.toFixed(2)}
                        </div>
                        <div
                          className={cn(
                            "text-xs",
                            position.pnlPercentage >= 0
                              ? "text-success"
                              : "text-destructive"
                          )}
                        >
                          {position.pnlPercentage >= 0 ? "+" : ""}
                          {position.pnlPercentage.toFixed(1)}%
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Vender
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === "closed" && (
            <div className="space-y-4">
              {closedPositions.map((position) => (
                <div key={position.id} className="glass rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={cn(
                            "stat-pill",
                            position.result === "won"
                              ? "bg-success/20 text-success"
                              : "bg-destructive/20 text-destructive"
                          )}
                        >
                          {position.result === "won" ? "Ganhou" : "Perdeu"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {position.date}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {position.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Aposta
                        </div>
                        <div className="font-mono">
                          {position.outcome === "yes" ? "SIM" : "NÃO"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Quantidade
                        </div>
                        <div className="font-mono">{position.quantity}</div>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <div className="text-xs text-muted-foreground">
                          Resultado
                        </div>
                        <div
                          className={cn(
                            "font-mono font-bold",
                            position.profit >= 0
                              ? "text-success"
                              : "text-destructive"
                          )}
                        >
                          {position.profit >= 0 ? "+" : ""}$
                          {position.profit.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "history" && (
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Tipo
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Mercado
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      Valor
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      Data
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      TX
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="p-4">
                        <span
                          className={cn(
                            "stat-pill",
                            tx.type === "buy"
                              ? "bg-success/20 text-success"
                              : tx.type === "sell"
                              ? "bg-destructive/20 text-destructive"
                              : "bg-primary/20 text-primary"
                          )}
                        >
                          {tx.type === "buy" ? (
                            <>
                              <ArrowUpRight className="w-3 h-3" /> Compra
                            </>
                          ) : tx.type === "sell" ? (
                            <>
                              <ArrowDownRight className="w-3 h-3" /> Venda
                            </>
                          ) : (
                            "Depósito"
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{tx.market || "-"}</td>
                      <td className="p-4 text-right font-mono">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="p-4 text-right text-sm text-muted-foreground">
                        {tx.date}
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={`https://polygonscan.com/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                        >
                          {tx.hash}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
