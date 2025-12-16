import {
  useSignAndExecuteTransaction,
  useSuiClientQuery,
  useCurrentAccount
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME, CLOCK_ID, USDC_TYPE } from "../constants";

export function useBuyNo() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const { data: coins } = useSuiClientQuery("getCoins", {
    owner: account?.address || "",
    coinType: USDC_TYPE
  });

  const buyNo = (marketId: string, sharesToBuy: number) => {
    if (!coins?.data) return;
    const tx = new Transaction();
    const cost = BigInt(sharesToBuy);

    const primaryCoin = coins.data.find((c) => BigInt(c.balance) >= cost);
    if (!primaryCoin) {
      alert("Saldo USDC insuficiente");
      return;
    }

    const [payment] = tx.splitCoins(tx.object(primaryCoin.coinObjectId), [
      cost
    ]);

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::buy_no`,
      arguments: [
        tx.object(marketId),
        payment,
        tx.pure.u64(sharesToBuy),
        tx.object(CLOCK_ID)
      ]
    });

    signAndExecute({ transaction: tx });
  };

  return { buyNo };
}
