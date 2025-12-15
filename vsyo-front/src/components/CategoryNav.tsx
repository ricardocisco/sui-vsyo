import { useState } from "react";
import {
  Landmark,
  Bitcoin,
  Trophy,
  FlaskConical,
  Globe,
  Tv,
  Building2,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const categories = [
  { id: "all", label: "Todos", icon: Sparkles },
  { id: "politics", label: "Política", icon: Landmark },
  { id: "crypto", label: "Cripto", icon: Bitcoin },
  { id: "sports", label: "Esportes", icon: Trophy },
  { id: "science", label: "Ciência", icon: FlaskConical },
  { id: "world", label: "Mundo", icon: Globe },
  { id: "entertainment", label: "Entretenimento", icon: Tv },
  { id: "business", label: "Negócios", icon: Building2 }
];

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryNav({
  selectedCategory,
  onCategoryChange
}: CategoryNavProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("category-scroll");
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex shrink-0"
        onClick={() => handleScroll("left")}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div
        id="category-scroll"
        className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide py-2"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <Button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 shrink-0",
                isSelected
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.label}</span>
            </Button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex shrink-0"
        onClick={() => handleScroll("right")}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
