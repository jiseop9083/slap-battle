import { NetworkEmitter, WalletEvents } from '@/api/networkEmitter';
import { getBuyOffers } from '@/api/requests/getBuyOffers';
import { createStore } from '@/store/store';
import { Amount, Client as xrplClient } from 'xrpl';
import { NFToken, Offer } from '@/types/wallet';

type State = {
  client: xrplClient | null;
  networkEmitter: NetworkEmitter | null;
  isOnEvent: boolean;
  // Wallet
  buyOffersByTokenId: Record<string, Offer[]>;
  sellOffersByTokenId: Record<string, Offer[]>;
  currencies: string[];
  nftokens: NFToken[];
};

type Action = {
  setClient: (client: xrplClient) => void;
  setNetworkEmitter: (networkEmitter: NetworkEmitter) => void;
  // functions of event callback
  _createBuyOffer:
    | ((index: string, tokenId: string, amount: Amount) => Promise<void>)
    | null;
  _acceptBuyOffer: ((index: string, tokenId: string) => void) | null;
  // functions for Wallet
  enableEvents: (address: string) => void;
  disableEvents: (address: string) => void;
};
type Store = State & Action;

export const useBuyOfferStore = createStore<Store>((set, get) => ({
  client: null,
  networkEmitter: null,
  isOnEvent: false,
  // Wallet
  balance: '',
  buyOffersByTokenId: {},
  sellOffersByTokenId: {},
  currencies: [],
  nftokens: [],
  setClient: (client) => set({ client: client }),
  setNetworkEmitter: (networkEmitter) =>
    set({ networkEmitter: networkEmitter }),
  _createBuyOffer: null,
  _acceptBuyOffer: null,

  enableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    if (isOnEvent) {
      return;
    }

    console.debug('added balance listener for ', address);

    const _createBuyOffer = async (
      index: string,
      tokenId: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      amount: Amount,
    ) => {
      const client = get().client;
      const buyOffersByTokenId = get().buyOffersByTokenId;
      if (!client) return;
      const buyOffers = await getBuyOffers(client, tokenId);
      console.debug('updating buy offers store ');
      set({
        buyOffersByTokenId: { ...buyOffersByTokenId, [tokenId]: buyOffers },
      });
    };

    const _acceptBuyOffer = (index: string, tokenId: string) => {
      console.debug('accept offer triggered: ', index, tokenId);
      const createBuyOffer = get()._createBuyOffer;
      createBuyOffer?.(index, tokenId, '0');
    };
    if (networkEmitter) {
      networkEmitter.on(address, WalletEvents.CreateBuyOffer, _createBuyOffer);
      networkEmitter.on(address, WalletEvents.AcceptBuyOffer, _acceptBuyOffer);
    }

    set({ isOnEvent: isOnEvent });
  },
  disableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    const _createBuyOffer = get()._createBuyOffer;
    const _acceptBuyOffer = get()._acceptBuyOffer;
    if (!isOnEvent) {
      return;
    }

    if (
      _createBuyOffer === null ||
      _acceptBuyOffer === null ||
      networkEmitter === null
    )
      return;
    console.debug('added balance listener for ', address);

    networkEmitter.off(address, WalletEvents.CreateBuyOffer, _createBuyOffer);
    networkEmitter.off(address, WalletEvents.AcceptBuyOffer, _acceptBuyOffer);

    set({ isOnEvent: isOnEvent });
  },
}));
