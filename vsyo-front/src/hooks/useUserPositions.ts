import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { TYPES } from "../constants";

export function useUserPositions() {
  const account = useCurrentAccount();

  return useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: { StructType: TYPES.POSITION },
      options: { showContent: true }
    },
    {
      enabled: !!account,
      select: (data) => {
        return data.data
          .map((obj) => {
            if (obj.data?.content?.dataType === "moveObject") {
              return {
                id: obj.data.objectId,
                ...(obj.data.content.fields as any)
              };
            }
            return null;
          })
          .filter(Boolean);
      }
    }
  );
}
