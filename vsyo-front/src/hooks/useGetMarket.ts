import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useGetMarket(marketId: string) {
  return useSuiClientQuery(
    "getObject",
    {
      id: marketId,
      options: {
        showContent: true
      }
    },
    {
      enabled: !!marketId,
      select: (data) => {
        if (data.data?.content?.dataType === "moveObject") {
          return data.data.content.fields as {
            id: string;
            description: string;
            market_type: string;
            deadline: string;
            yes_shares_sold: string;
            no_shares_sold: string;
            resolved: boolean;
            outcome: { fields: { val: boolean } } | null; // Option<bool>
            total_funds: string;
          };
        }
        return null;
      }
    }
  );
}
