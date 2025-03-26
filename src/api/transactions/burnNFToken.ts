import {
  NFTokenBurn,
  TxResponse,
  Client as xrplClient,
  Wallet as xrplWallet,
} from 'xrpl';

/**
 * Burns(Removes) a non-fungible token by submitting an NFTokenBurn transaction to the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - The wallet used to sign and submit the transaction.
 * @param {string} tokenID - The ID of the token to be burned.
 * @return {Promise<TxResponse<NFTokenBurn>>} A promise that resolves with the result of the transaction submission.
 */
export const burnNFToken = async (
  client: xrplClient,
  wallet: xrplWallet,
  tokenID: string = '',
): Promise<TxResponse<NFTokenBurn>> => {
  await client.connect();

  if (tokenID.length !== 64) {
    return Promise.reject('Invalid tokenID');
  }

  const nftokenBurnResponse = await client.submitAndWait(
    {
      TransactionType: 'NFTokenBurn',
      Account: wallet.address,
      NFTokenID: tokenID,
    },
    {
      autofill: true,
      wallet,
    },
  );

  return nftokenBurnResponse;
};
