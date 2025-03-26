import {
  Client as xrplClient,
  Wallet as xrplWallet,
  AccountSetAsfFlags,
  Transaction,
  TxResponse,
  AccountSet,
} from 'xrpl';

/**
 * Sets or clears the default ripple flag for a given XRPL wallet.
 *
 * @param {xrplClient} client - The XRPL client to use for connecting to the network.
 * @param {xrplWallet} wallet - The XRPL wallet to modify.
 * @param {boolean} rippling - Whether to set or clear the default ripple flag.
 * @return {Promise<TxResponse<AccountSet>>} A promise that resolves with the result of the transaction submission.
 */
export const setAllowRippling = async (
  client: xrplClient,
  wallet: xrplWallet,
  rippling: boolean,
): Promise<TxResponse<AccountSet>> => {
  await client.connect();

  const accountSetTx: Transaction = {
    TransactionType: 'AccountSet',
    Account: wallet.address,
  };

  if (rippling) {
    accountSetTx.SetFlag = AccountSetAsfFlags.asfDefaultRipple;
  } else {
    accountSetTx.ClearFlag = AccountSetAsfFlags.asfDefaultRipple;
  }

  const accountSetResponse = await client.submitAndWait(accountSetTx, {
    autofill: true,
    wallet,
  });

  return accountSetResponse;
};
