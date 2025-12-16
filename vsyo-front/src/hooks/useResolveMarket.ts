import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME, CLOCK_ID } from "../constants";

export function useResolveMarket() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const resolveMarket = (
    adminCapId: string,
    marketId: string,
    outcome: boolean
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::resolve_market`,
      arguments: [
        tx.object(adminCapId),
        tx.object(marketId),
        tx.pure.bool(outcome),
        tx.object(CLOCK_ID)
      ]
    });

    signAndExecute({ transaction: tx });
  };

  return { resolveMarket };
}
