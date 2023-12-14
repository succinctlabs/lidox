import { toHexString as _toHexString } from "@chainsafe/ssz";
import { phase0, ssz } from "@lodestar/types";
import { ConsensusClient } from "@succinctlabs/circomx";

export function hashBeaconBlockHeader(
  header: phase0.BeaconBlockHeader
): Uint8Array {
  return ssz.phase0.BeaconBlockHeader.hashTreeRoot(header);
}

export function toHexString(bytes: Uint8Array): string {
  return _toHexString(bytes);
}

export async function tryGetHeader(
  client: ConsensusClient,
  blockIdentifier: string | number | bigint
): Promise<phase0.BeaconBlockHeader | null> {
  const id = client.toStringFromBeaconId(blockIdentifier);
  const response = await client.client.get(
    "/eth/v1/beacon/headers/{block_id}".replace("{block_id}", id)
  );
  if (response.data.code === 404) {
    return null;
  }
  const header = ssz.phase0.BeaconBlockHeader.fromJson(
    response.data.data.header.message
  );
  return header;
}
