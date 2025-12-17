import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME } from "../constants";

export function useClaimWinnings() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const claimWinnings = (marketId: string, positionId: string) => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::claim_winnings`,
      arguments: [tx.object(marketId), tx.object(positionId)]
    });

    signAndExecute({ transaction: tx });
  };

  return { claimWinnings };
}
