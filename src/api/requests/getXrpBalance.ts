import { Client as xrplClient, LedgerIndex } from 'xrpl';

/**
 * Retrieves the XRP balance of a given address using the provided XRP client.
 *
 * @param {xrplClient} client - The XRP client used to connect to the XRP network.
 * @param {string} address - The address for which to retrieve the XRP balance.
 * @param {object} options - Optional parameters to specify the ledger to query.
 * @param {string} [options.ledger_hash] - (Optional) The hash of the ledger to retrieve the balance from.
 * @param {LedgerIndex} [options.ledger_index] - (Optional) The index of the ledger to retrieve the balance from.
 *
 * @returns {Promise<number>} - A promise that resolves to the XRP balance as a number.
 * @throws {Error} - If there is an error connecting to the XRP network or retrieving the balance.
 */
export const getXRPBalance = async (
  client: xrplClient,
  address: string,
  options: {
    ledger_hash?: string;
    ledger_index?: LedgerIndex;
  },
): Promise<number> => {
  await client.connect();

  return await client.getXrpBalance(address, options);
};
