import { useRef, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { MARKET_TYPES } from "../constants";

// Cria as tags de filtro baseadas nos tipos de mercado reais
const filterTags = [
  { id: "all", label: "All" },
  ...MARKET_TYPES.map((type) => ({ id: type, label: type }))
];

interface FilterTagsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onFilterClick?: () => void;
  onBookmarkClick?: () => void;
}

export function FilterTags({
  selectedFilter,
  onFilterChange,
  searchQuery = "",
  onSearchChange,
  onFilterClick,
  onBookmarkClick
}: FilterTagsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sincroniza o estado local com a prop quando ela mudar externamente
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    onSearchChange?.(value);
  };

  return (
    <div className="container mx-auto px-4 py-3">
      {/* Container principal: flex-col em mobile, flex-row em md+ */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-3">
        {/* Primeira div: Search, Filter e Bookmark */}
        <div className="flex items-center gap-2 flex-1 md:flex-initial min-w-0">
          {/* Search Input */}
          <div className="relative flex-1 md:w-40 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              value={localSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-8 h-8 text-xs bg-secondary border-0 rounded"
            />
          </div>

          {/* Filter & Bookmark Icons */}
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onClick={onFilterClick}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground shrink-0"
            title="Filtros avançados"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onClick={onBookmarkClick}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground shrink-0"
            title="Mercados salvos"
          >
            <Bookmark className="w-4 h-4" />
          </Button>

          {/* Divider - apenas em telas maiores */}
          <div className="hidden md:block w-px h-5 bg-border shrink-0" />
        </div>

        {/* Segunda div: Scroll Arrows e Filter Tags */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Scroll Arrow Left */}
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onClick={scrollLeft}
            className="p-1 rounded hover:bg-secondary text-muted-foreground shrink-0"
            title="Rolar para a esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Filter Tags */}
          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {filterTags.map((tag) => (
              <Button
                variant={selectedFilter === tag.id ? "default" : "outline"}
                size={"sm"}
                key={tag.id}
                onClick={() => onFilterChange(tag.id)}
                className={cn(
                  "whitespace-nowrap transition-colors shrink-0",
                  selectedFilter === tag.id
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-secondary"
                )}
              >
                {tag.label}
              </Button>
            ))}
          </div>

          {/* Scroll Arrow Right */}
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onClick={scrollRight}
            className="p-1 rounded hover:bg-secondary text-muted-foreground shrink-0"
            title="Rolar para a direita"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
