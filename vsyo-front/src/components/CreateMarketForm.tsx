import { useState } from "react";
import { useCreateMarket } from "../hooks/useCreateMarket"; // Hook criado anteriormente
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { USDC_TYPE } from "../constants";

export function CreateMarketForm({ adminCapId }: { adminCapId: string }) {
  const { createMarket } = useCreateMarket();
  const account = useCurrentAccount();
  const [desc, setDesc] = useState("");
  const [days, setDays] = useState(7);
  const [liquidity, setLiquidity] = useState(100); // Valor em cents (ex: 100 = 1 USDC)

  // Busca o objeto Coin<USDC> do usuário para usar na criação
  const { data: allCoins } = useSuiClientQuery("getAllCoins", {
    owner: account?.address || ""
  });

  const handleCreate = () => {
    console.log("--- DEBUG DIAGNÓSTICO ---");
    console.log("Constante USDC_TYPE atual:", USDC_TYPE);

    if (!allCoins?.data) {
      console.log("Nenhuma moeda carregada ainda.");
      return;
    }

    // Vamos listar tudo o que você tem na carteira
    allCoins.data.forEach((coin) => {
      const isMatch = coin.coinType === USDC_TYPE;
      console.log(
        `%c Saldo: ${coin.balance} | TYPE: ${coin.coinType} ${
          isMatch ? "✅ (IGUAL)" : "❌ (DIFERENTE)"
        }`,
        isMatch ? "color: green; font-weight: bold" : "color: red"
      );
    });

    // Tenta encontrar a moeda batendo com a constante
    const coin = allCoins.data.find(
      (c) => c.coinType === USDC_TYPE && BigInt(c.balance) >= BigInt(liquidity)
    );

    if (!coin) {
      alert(
        "ERRO: Não encontrei uma moeda com saldo suficiente que bata com o USDC_TYPE definido."
      );
      console.error(
        "Copie um dos TYPES listados no console (que tenha saldo) e coloque no seu constants.ts"
      );
      return;
    }

    // Calcula deadline em ms
    const deadlineMs = Date.now() + days * 24 * 60 * 60 * 1000;

    createMarket(adminCapId, desc, deadlineMs, liquidity, coin.coinObjectId);
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #444",
        borderRadius: "8px",
        marginBottom: "20px"
      }}
    >
      <h3>Criar Novo Mercado</h3>
      <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <input
          placeholder="Descrição (ex: O Bitcoin vai passar de 100k?)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <label>
          Duração (dias):
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </label>
        <label>
          Liquidez Inicial (USDC cents):
          <input
            type="number"
            value={liquidity}
            onChange={(e) => setLiquidity(Number(e.target.value))}
          />
        </label>
        <button onClick={handleCreate} disabled={!adminCapId}>
          Criar Mercado
        </button>
        {!adminCapId && (
          <small style={{ color: "red" }}>
            Apenas Admin pode criar (Conecte a conta Admin)
          </small>
        )}
      </div>
    </div>
  );
}
