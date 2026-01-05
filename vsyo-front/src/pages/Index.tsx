import { useState, useMemo } from "react";
import { MarketCard } from "../components/MarketCard";
import { Footer } from "../components/Footer";
import { FilterTags } from "../components/FilterTags";
import { Navbar } from "../components/Navbar";
import { useMarketList } from "../hooks/useMarketList";

const Index = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: markets, isPending, error } = useMarketList();

  // Filtra os mercados baseado no filtro selecionado e busca
  const filteredMarkets = useMemo(() => {
    if (!markets) return [];

    let filtered = markets;

    // Filtro por tipo
    if (selectedFilter !== "all") {
      filtered = filtered.filter((market) => market.type === selectedFilter);
    }

    // Filtro por busca (descrição)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (market) =>
          market.description.toLowerCase().includes(query) ||
          market.type.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [markets, selectedFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <FilterTags
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => {
          // TODO: Implementar modal de filtros avançados
          console.log("Filtros avançados");
        }}
        onBookmarkClick={() => {
          // TODO: Implementar página de mercados salvos
          console.log("Mercados salvos");
        }}
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
          {filteredMarkets.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-10">
              {searchQuery.trim()
                ? `Nenhum mercado encontrado para "${searchQuery}"${
                    selectedFilter !== "all" ? ` em ${selectedFilter}` : ""
                  }.`
                : selectedFilter === "all"
                ? "Nenhum mercado encontrado."
                : `Nenhum mercado encontrado para "${selectedFilter}".`}
            </p>
          ) : (
            <>
              {filteredMarkets.map((market) => (
                <MarketCard key={market.marketId} id={market.marketId} />
              ))}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
