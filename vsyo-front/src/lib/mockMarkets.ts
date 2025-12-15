export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume: string;
  traders: number;
  endDate: string;
  trend: "up" | "down" | "neutral";
  isHot?: boolean;
  isResolved?: boolean;
  resolution?: "yes" | "no" | null;
  createdAt: string;
}

export const mockMarkets: Market[] = [
  {
    id: "bitcoin-100k-2025",
    title: "Bitcoin atingirá $100K antes de março de 2025?",
    description:
      "O preço do Bitcoin ultrapassará a marca de $100.000 USD em qualquer exchange listada na CoinGecko antes de 1º de março de 2025?",
    category: "Cripto",
    yesPrice: 0.67,
    noPrice: 0.33,
    volume: "2.4M",
    traders: 4521,
    endDate: "Mar 2025",
    trend: "up",
    isHot: true,
    createdAt: "2024-01-15"
  },
  {
    id: "trump-2024",
    title: "Trump vencerá as eleições presidenciais de 2024?",
    description:
      "Donald Trump será eleito presidente dos Estados Unidos nas eleições de novembro de 2024?",
    category: "Política",
    yesPrice: 0.52,
    noPrice: 0.48,
    volume: "8.1M",
    traders: 12450,
    endDate: "Nov 2024",
    trend: "up",
    isHot: true,
    createdAt: "2024-01-01"
  },
  {
    id: "eth-merge-successful",
    title: "Ethereum terá zero downtime no próximo upgrade?",
    description:
      "A próxima atualização da rede Ethereum (Dencun) será implementada sem interrupções de serviço superiores a 30 minutos?",
    category: "Cripto",
    yesPrice: 0.85,
    noPrice: 0.15,
    volume: "890K",
    traders: 2100,
    endDate: "Fev 2025",
    trend: "neutral",
    createdAt: "2024-02-01"
  },
  {
    id: "brazil-copa-2026",
    title: "Brasil chegará às semifinais da Copa do Mundo 2026?",
    description:
      "A seleção brasileira de futebol masculino chegará às semifinais da Copa do Mundo FIFA 2026?",
    category: "Esportes",
    yesPrice: 0.71,
    noPrice: 0.29,
    volume: "1.2M",
    traders: 3200,
    endDate: "Jul 2026",
    trend: "down",
    createdAt: "2024-03-01"
  },
  {
    id: "spacex-starship-orbit",
    title: "SpaceX Starship completará órbita completa em 2025?",
    description:
      "O veículo Starship da SpaceX completará uma órbita completa ao redor da Terra e retornará com sucesso antes de 31 de dezembro de 2025?",
    category: "Ciência",
    yesPrice: 0.78,
    noPrice: 0.22,
    volume: "560K",
    traders: 1890,
    endDate: "Dez 2025",
    trend: "up",
    createdAt: "2024-02-15"
  },
  {
    id: "fed-rate-cut",
    title: "Fed cortará juros antes de junho de 2025?",
    description:
      "O Federal Reserve dos EUA reduzirá a taxa de juros básica antes de 1º de junho de 2025?",
    category: "Negócios",
    yesPrice: 0.89,
    noPrice: 0.11,
    volume: "3.5M",
    traders: 5600,
    endDate: "Jun 2025",
    trend: "up",
    isHot: true,
    createdAt: "2024-01-20"
  },
  {
    id: "ai-movie-oscar",
    title: "Filme com roteiro de IA ganhará Oscar até 2030?",
    description:
      "Um filme com roteiro escrito majoritariamente por inteligência artificial ganhará um Oscar em qualquer categoria até a cerimônia de 2030?",
    category: "Entretenimento",
    yesPrice: 0.23,
    noPrice: 0.77,
    volume: "180K",
    traders: 890,
    endDate: "Mar 2030",
    trend: "neutral",
    createdAt: "2024-03-10"
  },
  {
    id: "china-taiwan-2025",
    title: "Haverá conflito militar entre China e Taiwan em 2025?",
    description:
      "Ocorrerá qualquer ação militar direta entre China e Taiwan durante o ano de 2025?",
    category: "Mundo",
    yesPrice: 0.08,
    noPrice: 0.92,
    volume: "2.1M",
    traders: 4200,
    endDate: "Dez 2025",
    trend: "down",
    createdAt: "2024-01-05"
  }
];

export const featuredMarket = mockMarkets[0];
