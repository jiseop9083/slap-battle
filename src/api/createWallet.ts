import { Wallet, Client as xrplClient, Wallet as xrplWallet } from 'xrpl';
import { getNFTokens } from '@/api/requests/getNFTokens';
import { OfferStore, WalletInitialState } from '@/types/wallet';
import { getBalances } from '@/api/requests/getBalances';

/**
 * Creates a new wallet based on the provided seed. If no seed is provided, a new wallet is generated.
 *
 * @param {string} [seed] - (Optional) The seed used to create the wallet.
 * @return {Wallet} The created wallet.
 */
// recommend to use at MAIN_NET
export const createWallet = (seed?: string): Wallet => {
  if (seed) {
    return xrplWallet.fromSeed(seed);
  }
  return xrplWallet.generate();
};

/**
 * Creates and funds a wallet.
 *
 * @param {xrplClient} client - The XRPL client used to connect.
 * @param {string} [amount='1000'] - (Optional) The amount to fund the wallet with.
 * @param {string} [faucetHost] - (Optional) A custom host for a faucet server.
 * @param {string} [faucetPath] - (Optional)A custom path for a faucet server.
 * @return {Promise<xrplWallet>} The funded wallet.
 */
export const createAndFundWallet = async (
  client: xrplClient,
  amount: string = '1000',
  faucetHost?: string,
  faucetPath?: string,
): Promise<xrplWallet> => {
  await client.connect();

  const { wallet } = await client.fundWallet(null, {
    amount,
    faucetHost,
    faucetPath,
  });

  return wallet;
};

/**
 * Retrieves the initial state of a wallet including balance, currencies, tokens, buy offers, and sell offers.
 *
 * @param {xrplClient} client - The XRPL client used to retrieve the wallet state.
 * @param {string} address - The address of the wallet.
 * @return {Promise<WalletInitialState>} The initial state of the wallet including balance, currencies, tokens, buy offers, and sell offers.
 */
export const getInitialWalletState = async (
  client: xrplClient,
  address: string,
): Promise<WalletInitialState> => {
  const [initialBalance, initialCurrencies] = await getBalances(
    client,
    address,
  );
  const initialTokens = await getNFTokens(client, address);

  const initialBuyOffers: OfferStore = {};
  const initialSellOffers: OfferStore = {};

  initialTokens.forEach((token) => {
    initialBuyOffers[token.id] = [];
    initialSellOffers[token.id] = [];
  });
  return {
    balance: initialBalance,
    currencies: initialCurrencies,
    tokens: initialTokens,
    buyOffers: initialBuyOffers,
    sellOffers: initialSellOffers,
  };
};
