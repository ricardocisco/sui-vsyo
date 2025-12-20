import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useResolveMarket } from "../hooks/useResolveMarket";
import { Button } from "./ui/button";
import { TYPES } from "../constants";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminMarketControls({
  marketId,
  isResolved,
  deadline
}: {
  marketId: string;
  isResolved: boolean;
  deadline: string;
}) {
  const account = useCurrentAccount();
  const { resolveMarket } = useResolveMarket();

  const [isExpired, setIsExpired] = useState(
    () => Date.now() > Number(deadline)
  );

  useEffect(() => {
    const checkExpiration = () => {
      setIsExpired(Date.now() > Number(deadline));
    };

    checkExpiration();

    // Update every second to keep it fresh
    const interval = setInterval(checkExpiration, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  // Verifica se tem AdminCap
  const { data: ownedObjects } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: { StructType: TYPES.ADMIN_CAP }
    },
    { enabled: !!account }
  );

  const adminCapId = ownedObjects?.data?.[0]?.data?.objectId;

  // Se não for admin ou já estiver resolvido, não mostra nada
  if (!adminCapId || isResolved) return null;

  return (
    <div className="glass rounded-xl p-6 border-2 border-purple-500/20 bg-purple-500/5 mt-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-purple-400">
        <ShieldCheck className="w-5 h-5" />
        Painel de Administrador
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        O prazo expirou? Como administrador, você deve resolver este mercado.
      </p>
      {!isExpired && (
        <div className="mb-4 p-3 bg-yellow-500/20 text-yellow-500 text-sm rounded border border-yellow-500/50">
          ⚠️ Aguarde o prazo acabar (
          {new Date(Number(deadline)).toLocaleString()}) para resolver.
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4">
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={() => resolveMarket(adminCapId, marketId, true)}
        >
          Resolver como SIM
        </Button>
        <Button
          className="flex-1 bg-red-600 hover:bg-red-700"
          onClick={() => resolveMarket(adminCapId, marketId, false)}
        >
          Resolver como NÃO
        </Button>
      </div>
    </div>
  );
}
