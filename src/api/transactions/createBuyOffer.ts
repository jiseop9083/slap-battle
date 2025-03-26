import {
  Client as xrplClient,
  Wallet as xrplWallet,
  isoTimeToRippleTime,
  NFTokenCreateOffer,
  TxResponse,
} from 'xrpl';

/**
 * Creates a buy offer on the XRP Ledger network.
 *
 * @param {xrplClient} client - the XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - the wallet used to sign and submit the transaction.
 * @param {string} owner - the address of the owner of the token.
 * @param {string} tokenId - the ID of the token.
 * @param {string} amount - the amount of the token to be bought.
 * @param {Object} options - additional options for the buy offer.
 * @param {Date} options.expiration - the expiration date of the buy offer.
 * @param {number} options.flags - the flags for the buy offer.
 * @param {string} options.destination - the destination address for the bought tokens.
 * @return {Promise<TxResponse<NFTokenCreateOffer>>} a promise that resolves with the result of the transaction submission.
 */
export const createBuyOffer = async (
  client: xrplClient,
  wallet: xrplWallet,
  owner: string,
  tokenId: string,
  amount: string,
  options?: {
    expiration?: Date;
    flags?: number;
    destination?: string;
  },
): Promise<TxResponse<NFTokenCreateOffer>> => {
  await client.connect();

  const nftokenCreateResponse = await client.submitAndWait(
    {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.address,
      NFTokenID: tokenId,
      Flags: options?.flags,
      Amount: amount,
      Expiration: options?.expiration
        ? isoTimeToRippleTime(options.expiration)
        : undefined,
      Destination: options?.destination,
      Owner: owner,
    },
    {
      autofill: true,
      wallet,
    },
  );

  return nftokenCreateResponse;
};
