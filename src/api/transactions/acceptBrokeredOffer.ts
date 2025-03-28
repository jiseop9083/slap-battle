import {
  NFTokenAcceptOffer,
  TxResponse,
  Client as xrplClient,
  Wallet as xrplWallet,
} from 'xrpl';

/**
 * Accepts a brokered offer by submitting an NFTokenAcceptOffer transaction to the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - The wallet used to sign and submit the transaction.
 * @param {string} tokenBuyOfferId - The ID of the buy offer.
 * @param {string} tokenSellOfferId - The ID of the sell offer.
 * @param {string} fee - The fee amount for the broker.
 * @return {Promise<TxResponse<NFTokenAcceptOffer>>} A promise that resolves with the result of the transaction submission.
 */
export const acceptBrokeredOffer = async (
  client: xrplClient,
  wallet: xrplWallet,
  tokenBuyOfferId: string,
  tokenSellOfferId: string,
  fee: string,
): Promise<TxResponse<NFTokenAcceptOffer>> => {
  await client.connect();

  const nftokenAcceptResponse = await client.submitAndWait(
    {
      TransactionType: 'NFTokenAcceptOffer',
      Account: wallet.address,
      NFTokenBuyOffer: tokenBuyOfferId,
      NFTokenSellOffer: tokenSellOfferId,
      NFTokenBrokerFee: fee,
    },
    {
      autofill: true,
      wallet,
    },
  );

  return nftokenAcceptResponse;
};
