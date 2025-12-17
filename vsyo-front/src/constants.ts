export const PACKAGE_ID =
  "0x8ed1dc0544cd1ca1bfc0a84876da6e1b3aa643e084a54b6c4516c93b3d59689e";
export const MODULE_NAME = "vsyo";
export const ADMIN_CAP_ID =
  "0x9c7a06fc265ec6d2072c298d25c4eeb4404433c9be8b94b60c8d57c31ffa6879";

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
