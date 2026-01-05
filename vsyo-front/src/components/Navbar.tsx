/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Menu } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ConnectButton } from "@mysten/dapp-kit";
import { ModeToggle } from "./ui/mode-toggle";
import { useMarketList } from "../hooks/useMarketList";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { MarketTypeIcon } from "./MarketTypeIcon";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: markets } = useMarketList();

  // Filtra os mercados baseado na busca
  const searchResults = useMemo(() => {
    if (!markets || !searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    return markets
      .filter(
        (market) =>
          market.description.toLowerCase().includes(query) ||
          market.type.toLowerCase().includes(query)
      )
      .slice(0, 5); // Limita a 5 resultados
  }, [markets, searchQuery]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Abre o dropdown quando há busca
  useEffect(() => {
    setIsDropdownOpen(
      searchQuery.trim().length > 0 && searchResults.length > 0
    );
  }, [searchQuery, searchResults.length]);

  const handleMarketClick = (marketId: string) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    navigate(`/market/${marketId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card backdrop-blur supports-backdrop-filter:bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Menu Hambúrguer - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <a href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold">Vsyo</span>
              </a>

              <nav className="hidden items-center gap-6 md:flex">
                <a
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Markets
                </a>
                <a
                  href="/portfolio"
                  className="text-sm font-medium transition-colors hover:text-foreground"
                >
                  Portfolio
                </a>
                <a
                  href="/help"
                  className="text-sm font-medium transition-colors hover:text-foreground"
                >
                  Help
                </a>
              </nav>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              {/* Search - Desktop */}
              <div
                ref={searchRef}
                className="relative hidden w-full max-w-sm md:block"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim() && searchResults.length > 0) {
                      setIsDropdownOpen(true);
                    }
                  }}
                  className="w-full pl-9 pr-9"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Limpar busca"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Dropdown de resultados */}
                {isDropdownOpen && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-[100] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="p-1">
                      {searchResults.map((market) => (
                        <button
                          key={market.marketId}
                          onClick={() => handleMarketClick(market.marketId)}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-md",
                            "hover:bg-secondary transition-colors",
                            "flex items-start gap-3 group cursor-pointer"
                          )}
                        >
                          <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-secondary transition-colors text-primary">
                            {market.type ? (
                              <MarketTypeIcon
                                type={market.type}
                                className="w-6 h-6"
                              />
                            ) : (
                              <span className="text-lg">🔮</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {market.type && (
                                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-secondary/50 border border-border/50">
                                  {market.type}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                              {market.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <ModeToggle />

              <ConnectButton />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card">
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <div ref={searchRef} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    ref={inputRef}
                    type="search"
                    placeholder="Search markets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim() && searchResults.length > 0) {
                        setIsDropdownOpen(true);
                      }
                    }}
                    className="w-full pl-9 pr-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Limpar busca"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {/* Dropdown de resultados - Mobile */}
                  {isDropdownOpen && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-[100] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <div className="p-1">
                        {searchResults.map((market) => (
                          <button
                            key={market.marketId}
                            onClick={() => handleMarketClick(market.marketId)}
                            className={cn(
                              "w-full text-left px-3 py-2.5 rounded-md",
                              "hover:bg-secondary transition-colors",
                              "flex items-start gap-3 group cursor-pointer"
                            )}
                          >
                            <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 text-lg border border-border/50 group-hover:bg-secondary transition-colors">
                              🔮
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {market.type && (
                                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-secondary/50 border border-border/50">
                                    {market.type}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {market.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-2">
                  <a
                    href="/"
                    className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-secondary hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Markets
                  </a>
                  <a
                    href="/portfolio"
                    className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Portfolio
                  </a>
                  <a
                    href="/help"
                    className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Help
                  </a>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
