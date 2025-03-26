import { Currency } from '@/types/wallet';
import { Client as xrplClient, LedgerIndex } from 'xrpl';

/**
 * Retrieves the balances of a given address from the XRP Ledger using the provided client.
 *
 * @param {xrplClient} client - The client used to connect to the XRP Ledger.
 * @param {string} address - The address to retrieve balances for.
 * @param {object} options - Optional parameters to specify the ledger to query.
 * @param {string} [options.ledger_hash] - (Optional) Retrieve the account balances at the ledger with a given ledger_hash.
 * @param {LedgerIndex} [options.ledger_index] - (Optional) Retrieve the account balances at a given ledger_index.
 * @param {string} [options.peer] - (Optional) Filter balances by peer.
 * @param {number} [options.limit] - (Optional) Limit number of balances to return.
 * @return {Promise<[string, Currency[]]>} A promise that resolves to an array containing the initial balance and an array of Currency objects representing the balances of the address.
 */
export const getBalances = async (
  client: xrplClient,
  address: string,
  options?: {
    ledger_hash?: string;
    ledger_index?: LedgerIndex;
    peer?: string;
    limit?: number;
  },
): Promise<[string, Currency[]]> => {
  await client.connect();

  const balances = await client.getBalances(address, options);

  let initialBalance = '';
  const initialCurrencies: Currency[] = [];

  for (const balance of balances) {
    if (balance.currency === 'XRP') {
      initialBalance = balance.value;
    }

    if (balance.issuer) {
      initialCurrencies.push({
        currency: balance.currency,
        issuer: balance.issuer,
        value: parseFloat(balance.value) ?? 0,
      });
    }
  }

  return [initialBalance, initialCurrencies];
};
