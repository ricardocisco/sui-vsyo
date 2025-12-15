export interface MarketOption {
  label: string;
  probability: number;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  yesPrice: number;
  noPrice: number;
  traders: number;
  endDate: string;
  trend: "up" | "down" | "neutral";
  isHot?: boolean;
  isResolved?: boolean;
  resolution?: "yes" | "no" | null;
  createdAt: string;
  options?: MarketOption[];
  hasChanceIndicator?: boolean;
  hasLargeButtons?: boolean;
  chanceValue?: number;
  volume: string;
  creatorName?: string;
}

export const mockMarkets: Market[] = [
  {
    id: "fed-decision-january",
    title: "Fed decision in January?",
    description:
      "Will the U.S. Federal Reserve announce an interest rate cut during its January meeting?",
    category: "Finance",
    icon: "🏛️",
    options: [
      { label: "50+ bps decrease", probability: 1 },
      { label: "25 bps decrease", probability: 21 }
    ],
    volume: "20M",
    endDate: "Jan 2025",
    trend: "up",
    createdAt: "2024-12-01",
    yesPrice: 23,
    noPrice: 77,
    traders: 4800,
    isHot: false,
    isResolved: false,
    resolution: null
  },
  {
    id: "trump-fed-chair",
    title: "Who will Trump nominate as Fed Chair?",
    description:
      "Who will Donald Trump select as his nominee for Federal Reserve Chair if elected?",
    category: "Politics",
    icon: "🏛️",
    options: [
      { label: "Kevin Hassett", probability: 53 },
      { label: "Kevin Warsh", probability: 40 }
    ],
    volume: "56M",
    traders: 8400,
    isHot: true,
    trend: "neutral",
    isResolved: false,
    resolution: null,
    yesPrice: 0,
    noPrice: 0,
    createdAt: "2024-10-01",
    endDate: "Jan 2025"
  },
  {
    id: "maduro-out",
    title: "Maduro out by...?",
    description: "When will Nicolás Maduro leave the presidency of Venezuela?",
    category: "Geopolitics",
    icon: "🇻🇪",
    options: [
      { label: "December 31, 2025", probability: 8 },
      { label: "January 31, 2026", probability: 16 }
    ],
    volume: "25M",
    endDate: "Jan 2026",
    yesPrice: 0,
    noPrice: 0,
    createdAt: "2024-06-01",
    trend: "neutral",
    traders: 0,
    isResolved: false,
    resolution: null
  },
  {
    id: "us-venezuela-oil",
    title: "U.S. forces seize another Venezuela-linked oil ship?",
    description:
      "Will U.S. forces seize another oil ship linked to Venezuela before the end of 2024?",
    category: "Geopolitics",
    icon: "🇺🇸",
    hasChanceIndicator: true,
    chanceValue: 21,
    volume: "204K",
    isHot: true,
    options: [
      { label: "Yes", probability: 21 },
      { label: "No", probability: 79 }
    ],
    endDate: "Dec 2024",
    yesPrice: 0.21,
    noPrice: 0.79,
    traders: 192,
    trend: "down",
    createdAt: "2024-05-01",
    isResolved: false,
    resolution: null
  },
  {
    id: "trump-gold-cards",
    title: "How many Gold Cards will Trump sell in 2025?",
    description:
      "How many Trump 'Gold Cards' will be sold during the year 2025?",
    category: "Politics",
    icon: "🏛️",
    options: [
      { label: "0", probability: 92 },
      { label: "1–100", probability: 7 },
      { label: "Over 100", probability: 1 }
    ],
    volume: "7M",
    creatorName: "David Friedberg",
    endDate: "Dec 2025",
    yesPrice: 0,
    noPrice: 0,
    traders: 0,
    trend: "neutral",
    createdAt: "2024-06-01",
    isHot: false,
    isResolved: false,
    resolution: null
  },
  {
    id: "lighter-airdrop",
    title: "Will Lighter perform an airdrop by December?",
    description:
      "Will the Lighter protocol launch a token airdrop before December 2024?",
    category: "Crypto",
    icon: "📈",
    hasChanceIndicator: true,
    chanceValue: 94,
    options: [
      { label: "Yes", probability: 94 },
      { label: "No", probability: 6 }
    ],
    volume: "6M",
    trend: "up",
    yesPrice: 0.94,
    noPrice: 0.06,
    traders: 0,
    endDate: "Dec 2024",
    isHot: true,
    createdAt: "2024-06-01",
    isResolved: false,
    resolution: null
  },
  {
    id: "bitcoin-100k-2025",
    title: "Bitcoin will reach $100K before March 2025?",
    description:
      "Will Bitcoin surpass $100,000 USD on any major exchange before March 1st, 2025?",
    category: "Crypto",
    icon: "🪙",
    yesPrice: 0.67,
    noPrice: 0.33,
    volume: "2.4M",
    traders: 4521,
    endDate: "Mar 2025",
    hasLargeButtons: true,
    trend: "up",
    isHot: true,
    createdAt: "2024-01-15"
  },
  {
    id: "china-taiwan-2025",
    title: "China–Taiwan military conflict in 2025?",
    description:
      "Will any direct military conflict occur between China and Taiwan during 2025?",
    category: "World",
    icon: "🩻",
    yesPrice: 0.08,
    noPrice: 0.92,
    volume: "2.1M",
    traders: 4200,
    endDate: "Dec 2025",
    hasLargeButtons: true,
    trend: "down",
    createdAt: "2024-01-05"
  }
];

export const featuredMarket = mockMarkets[0];
