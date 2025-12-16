import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME, CLOCK_ID } from "../constants";

export function useSellPartial() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const sellPartial = (
    marketId: string,
    positionId: string,
    sharesToSell: number
  ) => {
    const tx = new Transaction();

    // Nota: A função sell_partial recebe &mut Position (referência)
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::sell_partial`,
      arguments: [
        tx.object(marketId),
        tx.object(positionId),
        tx.pure.u64(sharesToSell),
        tx.object(CLOCK_ID)
      ]
    });

    signAndExecute({ transaction: tx });
  };

  return { sellPartial };
}
