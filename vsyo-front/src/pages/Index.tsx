import { useState } from "react";
import { MarketCard } from "../components/MarketCard";
import { Footer } from "../components/Footer";
import { FilterTags } from "../components/FilterTags";
// import { Header } from "../components/Header";
import { Navbar } from "../components/Navbar";
import { mockMarkets } from "../lib/mockMarkets";

const Index = () => {
  //   const [selectedTab, setSelectedTab] = useState("trending");
  const [selectedFilter, setSelectedFilter] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* <Header selectedTab={selectedTab} onTabChange={setSelectedTab} /> */}
      <FilterTags
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <main className="mx-auto container py-4 px-4">
        {/* Markets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {mockMarkets.map((market) => (
            <MarketCard
              key={market.id}
              {...market}
              options={market.options ?? []}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
