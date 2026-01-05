import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME } from "../constants";

export function useCreateMarket() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const createMarket = (
    adminCapId: string,
    description: string,
    type: string,
    deadlineMs: number,
    initialLiquidityAmount: number,
    usdcCoinId: string // ID do objeto Coin<USDC> para liquidez inicial
  ) => {
    const tx = new Transaction();

    // Divide a moeda para a liquidez exata
    const [liquidityCoin] = tx.splitCoins(tx.object(usdcCoinId), [
      initialLiquidityAmount
    ]);

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_market`,
      arguments: [
        tx.object(adminCapId),
        tx.pure.string(description),
        tx.pure.string(type),
        tx.pure.u64(deadlineMs),
        liquidityCoin
      ],
      typeArguments: [] // create_market não é genérica, mas initial_liquidity é Coin<USDC>
    });

    signAndExecute({ transaction: tx });
  };

  return { createMarket };
}
