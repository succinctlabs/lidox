import { Hex } from "viem";

export type Config = {
  succinctOracleAddress: Hex;
  lidoLocatorAddress: Hex;
  chainId: number;
  consensusChainId: number;
  functionId: Hex;
};

export const ALL_CONFIGS: Record<string, Config> = {
  holesky: {
    succinctOracleAddress: "0xe90A3F2B97EeC62157ad48Dc26EBED28e60649c9",
    lidoLocatorAddress: "0x28FAB2059C713A7F9D8c86Db49f9bb0e96Af1ef8",
    chainId: 17000,
    consensusChainId: 17000,
    functionId:
      "0x7cf538c3c8d0a25c74c98b8022517c64cb4a0bf0213b56274a3c134ab1d10435",
  },
};
