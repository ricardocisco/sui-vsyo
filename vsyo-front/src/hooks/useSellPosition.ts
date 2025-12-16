import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME, CLOCK_ID } from "../constants";

export function useSellPosition() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const sellPosition = (marketId: string, positionId: string) => {
    const tx = new Transaction();

    // Nota: A função sell_position consome o objeto Position (por valor), deletando-o
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::sell_position`,
      arguments: [
        tx.object(marketId),
        tx.object(positionId),
        tx.object(CLOCK_ID)
      ]
    });

    signAndExecute({ transaction: tx });
  };

  return { sellPosition };
}
