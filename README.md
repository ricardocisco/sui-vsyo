# VSYO — Prediction Market on SUI

![License](https://img.shields.io/badge/license-MIT-blue)
![Build](https://img.shields.io/badge/build-passing-success)

VSYO é um projeto de **prediction market** desenvolvido na rede **Sui**. O foco é estritamente educacional, servindo como laboratório para explorar a implementação de contratos inteligentes baseados em AMM (Automated Market Maker) usando a linguagem Move.

## 🧩 Contexto
Este projeto foi desenvolvido como parte de estudos avançados em Web3 durante o bootcamp da Sui Foundation. O desafio principal foi fugir do modelo tradicional de Order Book (livro de ofertas) e implementar uma lógica descentralizada de formação de preços.

O projeto busca entender:
- Como preços e probabilidades emergem através da liquidez on-chain.
- A matemática por trás da troca de ativos em pools.
- O gerenciamento de estado e ownership no modelo de objetos da Sui.

## 🎯 Objetivo
Explorar a engenharia de um prediction market funcional, abordando:
- **Criação de Mercados:** Qualquer usuário pode instanciar um novo mercado binário (Sim/Não).
- **Liquidez Automatizada:** Uso de pools de liquidez para garantir que sempre haja uma contraparte para o trade.
- **Resolução:** Liquidação baseada em oráculos ou resolução manual (admin) para fins de teste.

> ⚠️ **Nota:** O foco do projeto não é financeiro ou comercial, mas sim técnico e conceitual.

## ⚖️ Arquitetura do AMM (Automated Market Maker)
Diferente de exchanges tradicionais onde um comprador precisa esperar um vendedor (Order Book), a VSYO utiliza um AMM. Isso significa que os usuários negociam contra um **Smart Contract (Liquidity Pool)**.

### Como funciona a lógica no contrato:
1.  **Pools de Liquidez:** Cada mercado possui duas "reservas" de valor, uma para o resultado `SIM` e outra para o `NÃO`.
2.  **Formação de Preço:** O preço de cada "share" (cota) é determinado matematicamente pela proporção de ativos no pool.
    * Se muitos usuários compram `SIM`, a quantidade de tokens `SIM` no pool diminui e a de `NÃO` aumenta.
    * Isso torna o `SIM` mais caro e o `NÃO` mais barato automaticamente.
3.  **Probabilidade Implícita:** O preço reflete a probabilidade do evento acontecer (ex: se o `SIM` custa 0.7 SUI, o mercado estima 70% de chance).

*Essa abordagem garante liquidez contínua e remove a necessidade de intermediários para casar ordens.*

## 🛠️ Tecnologias
| Tech | Descrição |
| :--- | :--- |
| **SUI** | Blockchain de alta performance baseada em objetos. |
| **Move** | Linguagem de smart contracts focada em segurança e recursos lineares. |
| **React + Vite** | Frontend rápido e reativo. |
| **Sui SDK** | Integração da carteira e chamadas RPC. |
| **TailwindCSS** | Estilização moderna e responsiva. |

## ⚙️ Funcionalidades
- [x] Conexão com SUI Wallet.
- [x] Visualização de mercados ativos.
- [x] Compra de posições (Sim/Não) via AMM.
- [x] Cálculo dinâmico de odds (probabilidades).

## 🔗 Links
- 🚀 **Live Demo:** [sui-vsyo.vercel.app](https://sui-vsyo.vercel.app)
- 👨‍💻 **Repositório:** [github.com/ricardocisco/sui-vsyo](https://github.com/ricardocisco/sui-vsyo)
