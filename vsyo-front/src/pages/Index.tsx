import { useState } from "react";
import { MarketCard } from "../components/MarketCard";
import { Footer } from "../components/Footer";
import { FilterTags } from "../components/FilterTags";
import { Navbar } from "../components/Navbar";
import { useMarketList } from "../hooks/useMarketList";

const Index = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { data: markets, isPending, error } = useMarketList();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <FilterTags
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <main className="flex-1 flex flex-col mx-auto container p-4">
        {isPending && (
          <div className="p-10 text-center">
            Carregando mercados da blockchain...
          </div>
        )}
        {error && (
          <div className="p-10 text-red-500">
            Erro ao carregar mercados: {error.message}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {markets?.length === 0 ? (
            <p>Nenhum mercado encontrado. Seja o primeiro a criar um!</p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {markets?.map((market) => (
                <MarketCard key={market.marketId} id={market.marketId} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
