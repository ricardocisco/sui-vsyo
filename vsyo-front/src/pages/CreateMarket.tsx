import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CreateMarketForm } from "../components/CreateMarketForm";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { TYPES } from "../constants";
import { Loader2, Lock } from "lucide-react";

export default function CreateMarket() {
  const account = useCurrentAccount();

  // Verifica se o usuário tem o AdminCap
  const { data: ownedObjects, isPending } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      filter: { StructType: TYPES.ADMIN_CAP }, // Filtra pelo TIPO correto
      options: { showType: true } // Boa prática
    },
    {
      enabled: !!account, // Só busca se tiver carteira conectada
      refetchOnWindowFocus: true // Se trocar de carteira, atualiza na hora
    }
  );

  const adminCapId = ownedObjects?.data?.[0]?.data?.objectId;
  const isAdmin = !!adminCapId;

  // Debug para você ver funcionando
  console.log("Check Admin:", {
    wallet: account?.address,
    hasObject: ownedObjects?.data?.length,
    adminCapId,
    targetType: TYPES.ADMIN_CAP
  });

  return (
    <div>
      <Navbar />
      <main className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center">
        {/* CASO 1: Carteira Desconectada */}
        {!account && (
          <div className="text-center p-10 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2">Conecte sua Carteira</h2>
            <p className="text-gray-500">
              Você precisa estar conectado para acessar esta área.
            </p>
          </div>
        )}

        {/* CASO 2: Carregando Verificação */}
        {account && isPending && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-500" />
            <p>Verificando permissões de administrador...</p>
          </div>
        )}

        {/* CASO 3: Conectado, mas NÃO é Admin */}
        {account && !isPending && !isAdmin && (
          <div className="max-w-md w-full p-6 bg-red-50 border border-red-200 rounded-xl text-center">
            <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">
              Acesso Negado
            </h2>
            <p className="text-red-600 mb-4">
              Sua carteira <strong>não possui o AdminCap</strong>.
            </p>
            <p className="text-sm text-gray-500 bg-white p-2 rounded border border-gray-200 font-mono break-all">
              Logado como: {account.address}
            </p>
            <div className="mt-4 text-xs text-gray-400">
              Esta área é restrita apenas para a criação de novos mercados.
            </div>
          </div>
        )}

        {/* CASO 4: É ADMIN (Sucesso) */}
        {account && !isPending && isAdmin && adminCapId && (
          <div className="w-full max-w-2xl">
            <div className="mb-4 p-2 bg-green-100 text-green-800 text-xs rounded text-center">
              🔓 Modo Administrador Ativo (Cap ID: {adminCapId.slice(0, 6)}...)
            </div>
            <CreateMarketForm adminCapId={adminCapId} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
