import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { ConnectButton } from "@mysten/dapp-kit";
import { ModeToggle } from "./ui/mode-toggle";

export function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
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
              <div className="relative hidden w-full max-w-sm md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search markets..."
                  className="w-full pl-9"
                />
              </div>

              <ModeToggle />

              <ConnectButton />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
