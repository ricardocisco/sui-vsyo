import { useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  ChevronRight
} from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

const filterTags = [
  { id: "all", label: "All" },
  { id: "trump", label: "Trump" },
  { id: "fed", label: "Fed" },
  { id: "syria", label: "Syria" },
  { id: "venezuela", label: "Venezuela" },
  { id: "ukraine", label: "Ukraine" },
  { id: "warner-bros", label: "Warner Bros" },
  { id: "best-2025", label: "Best of 2025" },
  { id: "epstein", label: "Epstein" },
  { id: "equities", label: "Equities" },
  { id: "weather", label: "Weather" },
  { id: "derivatives", label: "Derivatives" }
];

interface FilterTagsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterTags({
  selectedFilter,
  onFilterChange
}: FilterTagsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
      {/* Search Input */}
      <div className="relative w-40 shrink-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-8 h-8 text-xs bg-secondary border-0 rounded"
        />
      </div>

      {/* Filter & Bookmark Icons */}
      <Button
        variant={"ghost"}
        size={"icon-sm"}
        className="p-1.5 rounded hover:bg-secondary text-muted-foreground"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </Button>
      <Button
        variant={"ghost"}
        size={"icon-sm"}
        className="p-1.5 rounded hover:bg-secondary text-muted-foreground"
      >
        <Bookmark className="w-4 h-4" />
      </Button>

      {/* Divider */}
      <div className="w-px h-5 bg-border" />

      {/* Filter Tags */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1"
      >
        {filterTags.map((tag) => (
          <Button
            variant={"outline"}
            size={"sm"}
            key={tag.id}
            onClick={() => onFilterChange(tag.id)}
            className={cn(
              "filter-tag",
              selectedFilter === tag.id && "filter-tag-active"
            )}
          >
            {tag.label}
          </Button>
        ))}
      </div>

      {/* Scroll Arrow */}
      <Button
        variant={"ghost"}
        size={"icon-sm"}
        onClick={scrollRight}
        className="p-1 rounded hover:bg-secondary text-muted-foreground shrink-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
