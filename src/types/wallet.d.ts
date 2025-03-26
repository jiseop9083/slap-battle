import { Amount, IssuedCurrencyAmount, MPTAmount } from 'xrpl';

type Currency = {
  issuer: string;
  value: number;
  currency: string;
};

type NFTToken = {
  flags: number;
  issuer: string;
  id: string;
  taxon: number;
  uri: string;
};

type Offer = {
  index: string;
  amount: string;
  owner: string;
  expiration?: number;
  destination?: string;
};

type OfferStore = {
  [key in string]?: Offer[];
};

type TransactionLogEntry =
  | {
      type: 'PaymentSent';
      to: string;
      account: string;
      timestamp: number;
      payload: {
        amount: Amount | MPTAmount;
      };
      hash: string;
    }
  | {
      type: 'PaymentReceived';
      from: string;
      account: string;
      timestamp: number;
      payload: {
        amount: Amount | MPTAmount;
      };
      hash: string;
    }
  | {
      type: 'CurrencySent';
      to: string;
      account: string;
      timestamp: number;
      payload: {
        amount: IssuedCurrencyAmount;
      };
      hash: string;
    }
  | {
      type: 'CurrencyReceived';
      from: string;
      account: string;
      timestamp: number;
      payload: {
        amount: IssuedCurrencyAmount;
      };
      hash: string;
    }
  | {
      type: 'CreateSellOffer';
      timestamp: number;
      payload: {
        token: string;
        offerId: string;
      };
      hash: string;
    }
  | {
      type: 'AcceptSellOffer';
      timestamp: number;
      payload: {
        token: string;
        offerId: string;
      };
      hash: string;
    }
  | {
      type: 'TokenMint';
      timestamp: number;
      payload: {
        token: string;
      };
      hash: string;
    }
  | {
      type: 'TokenBurn';
      timestamp: number;
      payload: {
        token: string;
      };
      hash: string;
    };

type TransactionType = TransactionLogEntry['type'];

type WalletInitialState = {
  // wallet: xrplWallet;
  balance: string;
  currencies: Currency[];
  tokens: Token[];
  sellOffers: OfferStore;
  buyOffers: OfferStore;
};
