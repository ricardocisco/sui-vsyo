export const PACKAGE_ID =
  "0xfcf8d4cfc84b6ede1ca166b5e149e55eb05e2371452ab115b5d32ca7cca00d7a";
export const MODULE_NAME = "vsyo";
export const ADMIN_CAP_ID =
  "0xd9d1f985e9d0f628a5ffec2d7b7cfde5f358a79585c6998101666f0e4ba6f751";

// Substitua pelo tipo do USDC que você usou no contrato (ex: devnet USDC ou moeda mock)
export const USDC_TYPE =
  "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC";

// ID do objeto Clock do sistema (Sui Framework)
export const CLOCK_ID = "0x6";

export const TYPES = {
  MARKET: `${PACKAGE_ID}::${MODULE_NAME}::Market`,
  POSITION: `${PACKAGE_ID}::${MODULE_NAME}::Position`,
  ADMIN_CAP: `${PACKAGE_ID}::${MODULE_NAME}::AdminCap`
};

// Tipos de mercado disponíveis para criação e filtragem
export const MARKET_TYPES = [
  "Politics",
  "Sports",
  "Crypto",
  "Finance",
  "Geopolitics",
  "Earnings",
  "Tech",
  "Culture",
  "World",
  "Economy",
  "Climate & Science",
  "Elections",
  "Breaking",
  "New",
  "Trending"
];
