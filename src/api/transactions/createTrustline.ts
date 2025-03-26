import {
  Client as xrplClient,
  isValidAddress,
  Wallet as xrplWallet,
  TrustSet,
  TxResponse,
} from 'xrpl';
import { setAllowRippling } from '@/api/transactions/setAllowRippling';

/**
 * Creates a trustline between two wallets.
 *
 * @param {xrplClient} client - The XRPL client instance.
 * @param {xrplWallet} wallet - The wallet that is creating the trustline.
 * @param {string} targetWalletAddress - The address of the wallet that is receiving the trustline.
 * @param {string} currencyCode - The currency code of the trustline.
 * @param {string} limit - The limit of the trustline.
 * @return {Promise<TxResponse<TrustSet>>} A promise that resolves with the transaction response.
 * @throws {Promise<string>} If the target address is invalid or if the source and target addresses are the same.
 */
export const createTrustline = async (
  client: xrplClient,
  wallet: xrplWallet,
  targetWalletAddress: string,
  currencyCode: string,
  limit: string,
): Promise<TxResponse<TrustSet>> => {
  await client.connect();

  if (!isValidAddress(targetWalletAddress)) {
    return Promise.reject('Invalid target address');
  }

  if (wallet.address === targetWalletAddress) {
    return Promise.reject('Source and target addresses are the same');
  }

  // TODO Check the AllowRippling flag and branch code.
  await setAllowRippling(client, wallet, true);

  const trustLineSetResponse = await client.submitAndWait(
    {
      TransactionType: 'TrustSet',
      Account: wallet.address,
      LimitAmount: {
        currency: currencyCode,
        issuer: targetWalletAddress,
        value: limit,
      },
    },
    {
      autofill: true,
      wallet,
    },
  );

  return trustLineSetResponse;
};
