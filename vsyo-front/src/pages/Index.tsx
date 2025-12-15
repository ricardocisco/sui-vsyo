import { useState } from "react";

import { mockMarkets, featuredMarket } from "../lib/mockMarkets";
import { Sparkles, Clock, TrendingUp } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { FeaturedMarket } from "../components/Featuredmarket";
import { CategoryNav } from "../components/CategoryNav";
import { MarketCard } from "../components/MarketCard";
import { Footer } from "../components/Footer";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredMarkets =
    selectedCategory === "all"
      ? mockMarkets
      : mockMarkets.filter(
          (market) =>
            market.category.toLowerCase() === getCategoryMap(selectedCategory)
        );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Markets Section */}
        <section id="markets" className="mx-auto py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* Featured Market */}
            <div className="mb-12">
              <FeaturedMarket
                id={featuredMarket.id}
                title={featuredMarket.title}
                description={featuredMarket.description}
                yesPrice={featuredMarket.yesPrice}
                volume={featuredMarket.volume}
                traders={featuredMarket.traders}
                endDate={featuredMarket.endDate}
              />
            </div>

            {/* Category Navigation */}
            <div className="mb-8">
              <CategoryNav
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Hot Markets */}
            {selectedCategory === "all" && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-warning" />
                  <h2 className="text-xl font-bold text-foreground">
                    Mercados em Alta
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockMarkets
                    .filter((m) => m.isHot)
                    .map((market) => (
                      <MarketCard key={market.id} {...market} />
                    ))}
                </div>
              </div>
            )}

            {/* All Markets */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedCategory === "all"
                      ? "Todos os Mercados"
                      : `Mercados de ${getCategoryLabel(selectedCategory)}`}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Atualizado em tempo real</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMarkets.map((market, index) => (
                  <div
                    key={market.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <MarketCard {...market} />
                  </div>
                ))}
              </div>

              {filteredMarkets.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    Nenhum mercado encontrado nesta categoria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

function getCategoryMap(categoryId: string): string {
  const map: Record<string, string> = {
    politics: "política",
    crypto: "cripto",
    sports: "esportes",
    science: "ciência",
    world: "mundo",
    entertainment: "entretenimento",
    business: "negócios"
  };
  return map[categoryId] || categoryId;
}

function getCategoryLabel(categoryId: string): string {
  const map: Record<string, string> = {
    politics: "Política",
    crypto: "Cripto",
    sports: "Esportes",
    science: "Ciência",
    world: "Mundo",
    entertainment: "Entretenimento",
    business: "Negócios"
  };
  return map[categoryId] || categoryId;
}

export default Index;
