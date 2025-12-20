import { useState } from "react";
import { useCreateMarket } from "../hooks/useCreateMarket"; // Hook criado anteriormente
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { USDC_TYPE } from "../constants";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Calendar, DollarSign, Rocket, Type } from "lucide-react";

export function CreateMarketForm({ adminCapId }: { adminCapId: string }) {
  const { createMarket } = useCreateMarket();
  const account = useCurrentAccount();
  const [desc, setDesc] = useState("");
  const [days, setDays] = useState(7);
  const [liquidity, setLiquidity] = useState(100);

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
    <Card className="w-full max-w-2xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Rocket className="w-6 h-6 text-primary" />
          Criar Novo Mercado
        </CardTitle>
        <CardDescription>
          Defina as regras e a liquidez inicial para lançar um novo mercado de
          predição na blockchain.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            Descrição da Pergunta
          </Label>
          <Input
            id="description"
            placeholder="Ex: O Bitcoin vai ultrapassar $100k até Dezembro?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="text-lg py-6"
          />
          <p className="text-xs text-muted-foreground">
            Seja específico para evitar ambiguidades na resolução.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Duração */}
          <div className="space-y-2">
            <Label htmlFor="days" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Duração (Dias)
            </Label>
            <div className="relative">
              <Input
                id="days"
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Termina em: <span className="text-primary font-medium"></span>
            </p>
          </div>

          {/* Input Liquidez */}
          <div className="space-y-2">
            <Label htmlFor="liquidity" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Liquidez Inicial (Shares/Cents)
            </Label>
            <Input
              id="liquidity"
              type="number"
              min="100"
              value={liquidity}
              onChange={(e) => setLiquidity(Number(e.target.value))}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Valor real: <span className="text-green-500 font-medium"></span>{" "}
              (Considerando 6 decimais)
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {/* Aviso de Admin */}
        {!adminCapId && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acesso Restrito</AlertTitle>
            <AlertDescription>
              Sua carteira conectada não possui o AdminCap. Você não poderá
              confirmar a transação.
            </AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full text-lg py-6 font-semibold shadow-lg hover:shadow-primary/20 transition-all"
          onClick={handleCreate}
          disabled={!adminCapId || !desc}
        >
          {adminCapId
            ? "Lançar Mercado na Blockchain"
            : "Aguardando Permissão de Admin"}
        </Button>
      </CardFooter>
    </Card>
  );
}
