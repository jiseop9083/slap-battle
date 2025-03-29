import { TransactionLogEntry } from '@/types/wallet';
import { AccountTxResponse, Client, LedgerIndex } from 'xrpl';
import { isIssuedCurrency } from 'xrpl/dist/npm/models/transactions/common';
import { NFTokenAcceptOfferMetadata } from 'xrpl/dist/npm/models/transactions/NFTokenAcceptOffer';
import { NFTokenCreateOfferMetadata } from 'xrpl/dist/npm/models/transactions/NFTokenCreateOffer';
import { NFTokenMintMetadata } from 'xrpl/dist/npm/models/transactions/NFTokenMint';

/**
 * Retrieves a list of transactions for a given account.
 *
 * @param {Client} client - The XRPL client used to make the request.
 * @param {string} account - The account for which to retrieve transactions.
 * @param {Object} options - Optional parameters to specify the ledger to query.
 * @param {number} [options.ledger_index] - The ledger index of the ledger to use, or a shortcut string to choose a ledger automatically
 * @param {number} [options.limit] - The maximum number of transactions to retrieve. Default is no limit.
 * @return {Promise<AccountTxResponse>} A promise that resolves to the response containing the list of transactions.
 */
export const getTransactionsByAccount = async (
  client: Client,
  account: string,
  options?: {
    ledger_index?: LedgerIndex;
    limit?: number;
  },
): Promise<AccountTxResponse> => {
  const accountTxResponse = await client.request({
    command: 'account_tx',
    account,
    ledger_index_max: -1,
    ledger_index: options?.ledger_index,
    limit: options?.limit,
  });

  return accountTxResponse;
};

/**
 * Processes transactions from the response and categorizes them based on transaction type.
 *
 * @param {AccountTxResponse} accountTxResponse - The response containing transactions.
 * @return {TransactionLogEntry[]} An array of categorized transaction log entries.
 */
export const processTransactions = (
  accountTxResponse: AccountTxResponse | AccountTxResponse[],
): TransactionLogEntry[] => {
  const initialTransactions: TransactionLogEntry[] = [];

  const responses = Array.isArray(accountTxResponse)
    ? accountTxResponse
    : [accountTxResponse];

  // Flatten all transactions and sort the transactions by the 'date' property
  const allEntries = responses
    .flatMap((resp) =>
      resp.result.transactions.map((tx) => ({
        account: resp.result.account,
        transaction: tx,
      })),
    )
    .sort((a, b) => {
      const dateA = a.transaction.tx_json?.date ?? 0;
      const dateB = b.transaction.tx_json?.date ?? 0;
      return dateA - dateB;
    });

  for (const entry of allEntries) {
    const tx = entry.transaction.tx_json;

    console.debug(entry.account, 'parsing tx: ', entry);

    if (
      tx?.TransactionType === 'NFTokenCreateOffer' &&
      typeof entry.transaction.meta !== 'string'
    ) {
      if (tx?.Flags === 1) {
        initialTransactions.push({
          type: 'CreateSellOffer',
          payload: {
            token: tx.NFTokenID,
            offerId:
              (entry.transaction.meta as NFTokenCreateOfferMetadata).offer_id ??
              '',
          },
          timestamp: tx.date ?? 0,
          hash: tx.hash ?? tx.hash ?? '',
        });
      }
    }

    if (
      tx?.TransactionType === 'NFTokenAcceptOffer' &&
      typeof entry.transaction.meta !== 'string'
    ) {
      if (tx?.NFTokenSellOffer && tx?.Account === entry.account) {
        initialTransactions.push({
          type: 'AcceptSellOffer',
          payload: {
            token:
              (entry.transaction.meta as NFTokenAcceptOfferMetadata)
                .nftoken_id ?? '',
            offerId: tx.NFTokenSellOffer,
          },
          timestamp: tx.date ?? 0,
          hash: tx.hash ?? tx.hash ?? '',
        });
      }
    }

    if (
      tx?.TransactionType === 'NFTokenBurn' &&
      typeof entry.transaction.meta !== 'string' &&
      tx.Account === entry.account
    ) {
      initialTransactions.push({
        type: 'TokenBurn',
        payload: {
          token: tx.NFTokenID,
        },
        timestamp: tx.date ?? 0,
        hash: tx.hash ?? tx.hash ?? '',
      });
    }

    if (
      tx?.TransactionType === 'NFTokenMint' &&
      typeof entry.transaction.meta !== 'string' &&
      tx.Account === entry.account
    ) {
      initialTransactions.push({
        type: 'TokenMint',
        payload: {
          token:
            (entry.transaction.meta as NFTokenMintMetadata).nftoken_id ?? '',
        },
        timestamp: tx.date ?? 0,
        hash: tx.hash ?? tx.hash ?? '',
      });
    }

    if (tx?.TransactionType === 'Payment') {
      if (isIssuedCurrency(tx.Amount)) {
        // amount is currency, not xrp
        if (tx.Destination === entry.account) {
          initialTransactions.push({
            type: 'CurrencyReceived',
            from: tx.Account,
            payload: {
              amount: tx.Amount,
            },
            timestamp: tx.date ?? 0,
            account: tx.Destination,
            hash: tx.hash ?? tx.hash ?? '',
          });
        }

        if (tx.Account === entry.account) {
          initialTransactions.push({
            type: 'CurrencySent',
            to: tx.Destination,
            payload: {
              amount: tx.Amount,
            },
            timestamp: tx.date ?? 0,
            account: tx.Account,
            hash: tx.hash ?? tx.hash ?? '',
          });
        }
      } else {
        if (tx.Destination === entry.account) {
          initialTransactions.push({
            type: 'PaymentReceived',
            from: tx.Account,
            payload: {
              amount: tx.Amount,
            },
            timestamp: tx.date ?? 0,
            account: tx.Destination,
            hash: tx.hash ?? tx.hash ?? '',
          });
        }

        if (tx.Account === entry.account) {
          initialTransactions.push({
            type: 'PaymentSent',
            to: tx.Destination,
            payload: {
              amount: tx.Amount,
            },
            timestamp: tx.date ?? 0,
            account: tx.Account,
            hash: tx.hash ?? tx.hash ?? '',
          });
        }
      }
    }
  }

  return initialTransactions;
};
