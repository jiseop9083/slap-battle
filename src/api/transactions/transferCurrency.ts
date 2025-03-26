import {
  Client as xrplClient,
  isValidAddress,
  Wallet as xrplWallet,
  Amount,
  TxResponse,
  Payment,
} from 'xrpl';

/**
 * Sends a payment transaction to a destination address with the specified currency and amount.
 *
 * @param {xrplClient} client - The XRPL client used to send the transaction.
 * @param {xrplWallet} wallet - The wallet initiating the transaction.
 * @param {string} destinationAddress - The destination address for the payment.
 * @param {string} currencyCode - The currency code of the payment.
 * @param {string} amount - The amount of currency to be sent.
 * @return {Promise<TxResponse<Payment>>} A Promise that resolves with the result of the transaction submission.
 */
export const transferCurrency = async (
  client: xrplClient,
  wallet: xrplWallet,
  destinationAddress: string,
  currencyCode: string,
  amount: string,
): Promise<TxResponse<Payment>> => {
  await client.connect();

  if (!isValidAddress(destinationAddress)) {
    return Promise.reject('Invalid destination address');
  }

  if (wallet.address === destinationAddress) {
    return Promise.reject('Source and destination addresses are the same');
  }

  const paymentResponse = await client.submitAndWait(
    {
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: {
        currency: currencyCode,
        value: amount,
        issuer: wallet.address,
      },
      Destination: destinationAddress,
    },
    {
      autofill: true,
      wallet,
    },
  );

  return paymentResponse;
};

/**
 * Sends a currency amount from one wallet to a destination address.
 *
 * @param {xrplClient} client - The XRPL client used to send the transaction.
 * @param {xrplWallet} wallet - The wallet initiating the transaction.
 * @param {string} destinationAddress - The destination address for the payment.
 * @param {Amount} amount - The amount of currency to be sent.
 * @return {Promise<TxResponse<Payment>>} A Promise that resolves with the result of the transaction submission.
 */
export const transferCurrencyAmount = async (
  client: xrplClient,
  wallet: xrplWallet,
  destinationAddress: string,
  amount: Amount,
): Promise<TxResponse<Payment>> => {
  await client.connect();

  if (!isValidAddress(destinationAddress)) {
    return Promise.reject('Invalid destination address');
  }

  if (wallet.address === destinationAddress) {
    return Promise.reject('Source and destination addresses are the same');
  }

  const paymentResponse = await client.submitAndWait(
    {
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: amount,
      Destination: destinationAddress,
    },
    {
      autofill: true,
      wallet,
    },
  );

  return paymentResponse;
};
