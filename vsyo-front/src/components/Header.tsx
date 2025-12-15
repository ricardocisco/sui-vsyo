import { useState } from "react";
import { Search, ChevronDown, TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const mainCategories = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "breaking", label: "Breaking" },
  { id: "new", label: "New" },
  { id: "politics", label: "Politics" },
  { id: "sports", label: "Sports" },
  { id: "finance", label: "Finance" },
  { id: "crypto", label: "Crypto" },
  { id: "geopolitics", label: "Geopolitics" },
  { id: "earnings", label: "Earnings" },
  { id: "tech", label: "Tech" },
  { id: "culture", label: "Culture" },
  { id: "world", label: "World" },
  { id: "economy", label: "Economy" },
  { id: "elections", label: "Elections" },
  { id: "mentions", label: "Mentions" },
  { id: "more", label: "More", hasDropdown: true }
];

interface HeaderProps {
  selectedTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Header({
  selectedTab = "trending",
  onTabChange = () => {}
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="container mx-auto px-4">
      <nav className="hidden lg:flex items-center gap-1 px-4 h-10 overflow-x-auto scrollbar-hide">
        {mainCategories.map((cat) => (
          <Button
            variant={"ghost"}
            key={cat.id}
            onClick={() => onTabChange(cat.id)}
            className={cn(
              "nav-tab flex items-center gap-1",
              selectedTab === cat.id && "nav-tab-active"
            )}
          >
            {cat.icon && <cat.icon className="w-4 h-4" />}
            {cat.label}
            {cat.hasDropdown && <ChevronDown className="w-3 h-3" />}
          </Button>
        ))}
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search polymarket"
                className="pl-10 h-9 bg-secondary border-0 rounded-full text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {mainCategories.slice(0, 10).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onTabChange(cat.id);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "filter-tag",
                    selectedTab === cat.id && "filter-tag-active"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
