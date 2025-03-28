import { NetworkEmitter, WalletEvents } from '@/api/networkEmitter';
import { createStore } from '@/store/store';
import { Amount, Client as xrplClient } from 'xrpl';
import { Offer } from '@/types/wallet';
import { getSellOffers } from '@/api/requests/getSellOffers';

type State = {
  client: xrplClient | null;
  networkEmitter: NetworkEmitter | null;
  isOnEvent: boolean;
  // Wallet
  sellOffersByTokenId: Record<string, Offer[]>;
};

type Action = {
  setClient: (client: xrplClient) => void;
  setNetworkEmitter: (networkEmitter: NetworkEmitter) => void;
  // functions of event callback
  _createSellOffer:
    | ((index: string, tokenId: string, amount: Amount) => Promise<void>)
    | null;
  _acceptSellOffer: ((index: string, tokenId: string) => void) | null;
  // functions for Wallet
  enableEvents: (address: string) => void;
  disableEvents: (address: string) => void;
};
type Store = State & Action;

export const useSellOfferStore = createStore<Store>((set, get) => ({
  client: null,
  networkEmitter: null,
  isOnEvent: false,
  // Wallet
  sellOffersByTokenId: {},
  setClient: (client) => set({ client: client }),
  setNetworkEmitter: (networkEmitter) =>
    set({ networkEmitter: networkEmitter }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createSellOffer: null,
  _acceptSellOffer: null,
  // fuctions for Wallet
  enableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    if (isOnEvent) {
      return;
    }

    console.debug('added balance listener for ', address);

    const _createSellOffer = async (
      index: string,
      tokenId: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      amount: Amount,
    ) => {
      const client = get().client;
      const sellOffersByTokenId = get().sellOffersByTokenId;
      if (!client) return;
      const sellOffers = await getSellOffers(client, tokenId);

      console.debug('updating buy offers store ');
      set({
        sellOffersByTokenId: { ...sellOffersByTokenId, [tokenId]: sellOffers },
      });
    };

    const _acceptSellOffer = (index: string, tokenId: string) => {
      const createSellOffer = get()._createSellOffer;
      console.debug('accept offer triggered: ', index, tokenId);
      createSellOffer?.(index, tokenId, '0');
    };

    if (networkEmitter) {
      networkEmitter.on(address, WalletEvents.CreateBuyOffer, _createSellOffer);
      networkEmitter.on(address, WalletEvents.AcceptBuyOffer, _acceptSellOffer);
    }

    set({ isOnEvent: isOnEvent });
  },
  disableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    const _createSellOffer = get()._createSellOffer;
    const _acceptSellOffer = get()._acceptSellOffer;
    if (!isOnEvent) {
      return;
    }

    if (
      _createSellOffer === null ||
      _acceptSellOffer === null ||
      networkEmitter === null
    )
      return;

    console.debug('added balance listener for ', address);

    networkEmitter.off(address, WalletEvents.CreateSellOffer, _createSellOffer);
    networkEmitter.off(address, WalletEvents.AcceptSellOffer, _acceptSellOffer);

    set({ isOnEvent: isOnEvent });
  },
}));
