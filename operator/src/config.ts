import { Hex } from "viem";

export type Config = {
  succinctOracleAddress: Hex;
  lidoLocatorAddress: Hex;
  chainId: number;
  consensusChainId: number;
  functionId: Hex;
};

export const ALL_CONFIGS: Record<string, Config> = {
  sepolia: {
    succinctOracleAddress: "0x16681d10589856fb223b7a20663edf662c591976",
    lidoLocatorAddress: "0x8f6254332f69557A72b0DA2D5F0Bc07d4CA991E7",
    chainId: 11155111,
    consensusChainId: 11155111,
    functionId:
      "0x7cf538c3c8d0a25c74c98b8022517c64cb4a0bf0213b56274a3c134ab1d10435",
  },
  holesky: {
    succinctOracleAddress: "0x7DEE138A6faf87A9025Af21c3C3cE0658e13a574",
    lidoLocatorAddress: "0x28FAB2059C713A7F9D8c86Db49f9bb0e96Af1ef8",
    chainId: 17000,
    consensusChainId: 17000,
    functionId:
      "0x7cf538c3c8d0a25c74c98b8022517c64cb4a0bf0213b56274a3c134ab1d10435",
  },
};
