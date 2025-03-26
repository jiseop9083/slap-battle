import {
  NFTokenAcceptOffer,
  TxResponse,
  Client as xrplClient,
  Wallet as xrplWallet,
} from 'xrpl';

/**
 * Accepts a buy offer by submitting an NFTokenAcceptOffer transaction to the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - The wallet used to sign and submit the transaction.
 * @param {string} tokenOfferId - The ID of the buy offer.
 * @return {Promise<TxResponse<NFTokenAcceptOffer>>} A promise that resolves with the result of the transaction submission.
 */
export const acceptBuyOffer = async (
  client: xrplClient,
  wallet: xrplWallet,
  tokenOfferId: string,
): Promise<TxResponse<NFTokenAcceptOffer>> => {
  await client.connect();

  const nftokenAcceptResponse = await client.submitAndWait(
    {
      TransactionType: 'NFTokenAcceptOffer',
      Account: wallet.address,
      NFTokenBuyOffer: tokenOfferId,
    },
    {
      autofill: true,
      wallet,
    },
  );

  return nftokenAcceptResponse;
};
