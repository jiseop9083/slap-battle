import { Offer } from '@/types/wallet';
import { Client as xrplClient, LedgerIndex } from 'xrpl';

/**
 * Retrieves buy offers for a specific token from the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {string} tokenId - The ID of the token for which buy offers are requested.
 * @param {LedgerIndex} ledger_index - (Optional) The ledger index of the ledger to use, or a shortcut string to choose a ledger automatically
 * @param {number} limit - (Optional) Limit the number of NFT sell offers to retrieve. This value cannot be lower than 50 or more than 500. Positive values outside this range are replaced with the closest valid option. The default is 250.
 * @return {Promise<Offer[]>} An array of Offer objects representing the buy offers for the specified token.
 */
export const getBuyOffers = async (
  client: xrplClient,
  tokenId: string,
  ledger_index?: LedgerIndex,
  limit?: number,
): Promise<Offer[]> => {
  await client.connect();

  const response = await client.request({
    command: 'nft_buy_offers',
    nft_id: tokenId,
    ledger_index: ledger_index,
    limit: limit,
  });

  const offers: Offer[] = response.result.offers.map((offer) => {
    return {
      amount:
        typeof offer.amount === 'string' ? offer.amount : offer.amount.value,
      index: offer.nft_offer_index,
      owner: offer.owner,
      expiration: offer.expiration,
      destination: offer.destination,
    };
  });

  return offers;
};
