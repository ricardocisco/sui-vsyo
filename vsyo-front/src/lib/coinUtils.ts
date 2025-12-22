/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "@mysten/sui/transactions";

export const splitCoinByAmount = (
  tx: Transaction,
  amount: bigint,
  allCoins: any[]
) => {
  // Lógica simplificada: Pega a primeira moeda com saldo suficiente
  // Em produção, você deve somar moedas (merge) se necessário
  const primaryCoin = allCoins.find((c) => BigInt(c.balance) >= amount);

  if (!primaryCoin) throw new Error("Saldo de USDC insuficiente");

  // Se for o objeto de gas (SUI) e a coinType for SUI, usa tx.gas.
  // Mas aqui estamos falando de USDC, então:

  const coinInput = tx.object(primaryCoin.coinObjectId);
  const [split] = tx.splitCoins(coinInput, [amount]);
  return split;
};
