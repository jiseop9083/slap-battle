import { NFTToken } from '@/types/wallet';
import { Client as xrplClient, convertHexToString, LedgerIndex } from 'xrpl';

/**
 * Retrieves a list of NFT tokens associated with a given address.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the XRPL network.
 * @param {string} address - The address for which to retrieve the tokens.
 * @param {LedgerIndex} ledger_index - (Optional) The ledger index of the ledger to use, or a shortcut string to choose a ledger automatically
 * @param {number} limit - (Optional) Limit the number of NFT sell offers to retrieve. This value cannot be lower than 50 or more than 500. Positive values outside this range are replaced with the closest valid option. The default is 250.

 * @return {Promise<NFTToken[]>} A promise that resolves to an array of tokens.
 */
export const getNftTokens = async (
  client: xrplClient,
  address: string,
  ledger_index?: LedgerIndex,
  limit?: number,
): Promise<NFTToken[]> => {
  await client.connect();

  // TODO: data is paginated, request must be sent multiple times using the  marker field (nfts.result.marker) - rate limited
  const nfts = await client.request({
    command: 'account_nfts',
    account: address,
    ledger_index: ledger_index,
    limit: limit,
  });

  const nftTokens: NFTToken[] = nfts.result.account_nfts.map((nft) => {
    return {
      flags: nft.Flags,
      id: nft.NFTokenID,
      issuer: nft.Issuer,
      taxon: nft.NFTokenTaxon,
      uri: nft.URI ? convertHexToString(nft.URI) : '',
    };
  });

  return nftTokens;
};
