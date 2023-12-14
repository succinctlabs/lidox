import { ConsensusClient } from "@succinctlabs/circomx";
import axios from "axios";
import {
  Chain,
  Hex,
  PrivateKeyAccount,
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  getContract,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { goerli, holesky, mainnet } from "viem/chains";
import {
  LIDO_ACCOUNTING_ORACLE_ABI,
  LIDO_HASH_CONSENSUS_ABI,
  LIDO_LOCATOR_ABI,
  SUCCINCT_LIDO_ORACLE_V1_ABI,
} from "./abi.js";
import { Config } from "./config.js";
import { hashBeaconBlockHeader, toHexString, tryGetHeader } from "./util.js";

type ParentClient = {
  source: PublicClient;
  target: PublicClient;
  wallet: WalletClient;
  consensus: ConsensusClient;
};

export class Operator {
  config: Config;
  client: ParentClient;
  account: PrivateKeyAccount;
  chain: Chain;

  stopped = false;

  constructor(config: Config) {
    this.config = config;
    console.log("Using config:", config);

    switch (config.chainId) {
      case 1:
        this.chain = mainnet;
        break;
      case 5:
        this.chain = goerli;
        break;
      case 17000:
        this.chain = holesky;
        break;
      default:
        throw new Error(`No chain found for chain id ${config.chainId}`);
    }

    const sourceRpc = process.env[`RPC_${config.consensusChainId}`];
    if (!sourceRpc) {
      throw new Error(
        `No source rpc url found for chain id ${config.consensusChainId}`
      );
    }
    const sourceTransport = http(sourceRpc);
    const sourceClient = createPublicClient({
      chain: this.chain,
      transport: sourceTransport,
    });
    const rpc = process.env[`RPC_${config.chainId}`];
    if (!rpc) {
      throw new Error(`No rpc url found for chain id ${config.chainId}`);
    }
    const transport = http(rpc);
    const targetClient = createPublicClient({
      chain: this.chain,
      transport,
    });
    const walletClient = createWalletClient({
      chain: this.chain,
      transport,
    });
    const envKey = process.env.PRIVATE_KEY || "";
    const key = envKey.startsWith("0x")
      ? (envKey as Hex)
      : (`0x${envKey}` as const);
    this.account = privateKeyToAccount(key);

    const consensusRpc = process.env[`CONSENSUS_RPC_${config.chainId}`];
    if (!consensusRpc) {
      throw new Error(
        `No consensus rpc url found for chain id ${config.chainId}`
      );
    }
    const client = axios.create({
      baseURL: consensusRpc,
      responseType: "json",
      headers: { "Content-Type": "application/json" },
    });
    const beaconClient = new ConsensusClient(client, 32, 8192);

    this.client = {
      source: sourceClient,
      target: targetClient,
      wallet: walletClient,
      consensus: beaconClient,
    };
  }

  async start() {
    process.on("SIGINT", () => {
      if (this.stopped) {
        console.log("Force stopping..");
        process.exit();
      } else {
        console.log("Stopping.. (Ctrl-C again to force)");
        this.stopped = true;
      }
    });

    console.log("Starting operator...");
    this.run();
    console.log("Operator started.");
  }

  async run() {
    while (!this.stopped) {
      const startTime = Date.now();
      console.log("Running loop at " + new Date().toISOString());
      await this.loop();
      console.log("Finished after " + (Date.now() - startTime) / 1000 + "sec.");

      const timeToSleep = Math.max(
        this.config.intervalMs - (Date.now() - startTime),
        0
      );
      await new Promise((resolve) => setTimeout(resolve, timeToSleep));
    }
  }

  async loop() {
    try {
      const succinctOracle = getContract({
        abi: SUCCINCT_LIDO_ORACLE_V1_ABI,
        address: this.config.succinctOracleAddress,
        publicClient: this.client.target,
        walletClient: this.client.wallet,
      });

      const lidoLocator = getContract({
        abi: LIDO_LOCATOR_ABI,
        address: this.config.lidoLocatorAddress,
        publicClient: this.client.source,
      });

      const accountingOracleAddress = await lidoLocator.read.accountingOracle();

      const lidoAccountingOracle = getContract({
        abi: LIDO_ACCOUNTING_ORACLE_ABI,
        address: accountingOracleAddress,
        publicClient: this.client.source,
      });

      const lidoHashConsensusAddress =
        await lidoAccountingOracle.read.getConsensusContract();

      const lidoHashConsensus = getContract({
        abi: LIDO_HASH_CONSENSUS_ABI,
        address: lidoHashConsensusAddress,
        publicClient: this.client.source,
      });

      const [refSlot, deadlineSlot] =
        await lidoHashConsensus.read.getCurrentFrame();

      console.log("Ref slot:", refSlot);

      // Check if succinct oracle has refSlot
      const [alreadyRequested, alreadyReceived] =
        await succinctOracle.read.reports([refSlot]);
      console.log("alreadyRequested:", alreadyRequested);
      console.log("alreadyReceived:", alreadyReceived);
      if (!alreadyReceived) {
        console.log("Succinct oracle does not have ref slot, requesting");

        if (alreadyRequested) {
          console.log("Already requested, skipping");
          return;
        }

        const finalizedHeader = await this.client.consensus.getHeader(
          "finalized"
        );
        if (finalizedHeader.slot >= deadlineSlot) {
          console.log("Finalized header is past deadline slot, skipping");
          return;
        }
        const header = await getFirstNonMissedSlot(
          this.client.consensus,
          Number(refSlot),
          finalizedHeader.slot
        );
        const blockRoot = toHexString(hashBeaconBlockHeader(header)) as Hex;
        await succinctOracle.write.requestUpdate([blockRoot, refSlot, 500000], {
          account: this.account,
          chain: this.chain,
        });
      } else {
        console.log("Succinct oracle has ref slot");
      }
    } catch (e) {
      console.error("Error in loop:", e);
    }
  }
}

// https://github.com/lidofinance/lido-oracle/blob/74265f4d641d69774fc97caebc22e7c3ff84ace5/src/utils/slot.py#L25
async function getFirstNonMissedSlot(
  client: ConsensusClient,
  targetSlot: number,
  finalizedSlot: number
) {
  for (let i = targetSlot; i <= finalizedSlot; i++) {
    const header = await tryGetHeader(client, i);
    if (header) return header;
  }
  throw new Error("No non-missed slot found");
}
