// src/hooks/useMarkets.ts
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { PACKAGE_ID, MODULE_NAME } from "../constants";

export function useMarketList() {
  // Busca eventos do tipo "MarketCreated"
  return useSuiClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::MarketCreated`
      },
      order: "descending" // Mostra os mais recentes primeiro
    },
    {
      refetchInterval: 10000, // Atualiza a cada 10s para ver novos mercados
      select: (data) => {
        return data.data.map((event) => {
          const parsed = event.parsedJson as any;
          return {
            marketId: parsed.market_id as string,
            description: parsed.description as string, // Descrição inicial (imutável no evento)
            type: parsed.market_type as string,
            createdAt: Number(event.timestampMs)
          };
        });
      }
    }
  );
}
