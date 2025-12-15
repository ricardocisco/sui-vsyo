import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="w-full mx-auto px-4 py-16 md:py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div
        className="
        absolute top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
        w-[280px] h-[280px]
        sm:w-[400px] sm:h-[350px]
        md:w-[600px] md:h-[450px]
        lg:w-[800px] lg:h-[600px]
        bg-primary/5
        rounded-full
        blur-3xl
      "
      />

      <div>
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">
              Mercados descentralizados • On-chain
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
            Preveja o futuro.{" "}
            <span className="gradient-text">Lucre com conhecimento.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Negocie contratos em eventos do mundo real. Política, cripto,
            esportes e muito mais — tudo na blockchain com total transparência.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button asChild>
              <Link to="/#markets">
                Explorar Mercados
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild>
              <Link to="/help">Como Funciona</Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-6 md:gap-12 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                $24M+
              </div>
              <div className="text-sm text-muted-foreground">Volume Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                12K+
              </div>
              <div className="text-sm text-muted-foreground">
                Traders Ativos
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                450+
              </div>
              <div className="text-sm text-muted-foreground">Mercados</div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div
          className="flex items-center justify-center gap-6 mt-12 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-xs">Contratos Auditados</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs">Liquidação Automática</span>
          </div>
        </div>
      </div>
    </section>
  );
}
