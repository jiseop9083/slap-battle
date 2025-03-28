import { NetworkEmitter, WalletEvents } from '@/api/networkEmitter';
import { createStore } from '@/store/store';
import { Client as xrplClient } from 'xrpl';
import { NFToken } from '@/types/wallet';
import { getNFTokens } from '@/api/requests/getNFTokens';

type State = {
  isConnected: boolean;
  client: xrplClient | null;
  networkEmitter: NetworkEmitter | null;
  isOnEvent: boolean;
  // Wallet
  nftokens: NFToken[];
};

type Action = {
  setClient: (client: xrplClient) => void;
  setNetworkEmitter: (networkEmitter: NetworkEmitter) => void;
  // functions of event callback
  _mintNftoken: ((token: string, timestamp: number) => Promise<void>) | null;
  _burnNftoken: ((token: string, timestamp: number) => Promise<void>) | null;
  _acceptBuyOffer: ((index: string, tokenId: string) => Promise<void>) | null;
  _acceptSellOffer: ((index: string, tokenId: string) => void) | null;

  // functions for Wallet
  fetchNftoken: (address: string) => Promise<void>;
  enableEvents: (address: string) => void;
  disableEvents: (address: string) => void;
};
type Store = State & Action;

export const useNftokenStore = createStore<Store>((set, get) => ({
  isConnected: false,
  client: null,
  networkEmitter: null,
  isOnEvent: false,
  // Wallet
  nftokens: [],
  setClient: (client) => set({ client: client }),
  setNetworkEmitter: (networkEmitter) =>
    set({ networkEmitter: networkEmitter }),
  _mintNftoken: null,
  _acceptBuyOffer: null,
  _acceptSellOffer: null,
  _burnNftoken: null,
  // fuctions for Wallet
  fetchNftoken: async (address) => {
    const client = get().client;
    if (!client) return;
    const nftokens = await getNFTokens(client, address);
    set({ nftokens: nftokens });
  },
  enableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    if (isOnEvent) {
      return;
    }

    console.debug('added balance listener for ', address);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _acceptBuyOffer = async (index: string, tokenId: string) => {
      const client = get().client;
      if (!client) return;
      const nftokens = await getNFTokens(client, address);
      set({ nftokens: nftokens });
    };
    const _acceptSellOffer = _acceptBuyOffer;
    set({ _acceptBuyOffer: _acceptBuyOffer });
    set({ _acceptSellOffer: _acceptSellOffer });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _mintNftoken = async (token: string, timestamp: number) => {
      const client = get().client;
      if (!client) return;
      const nftokens = await getNFTokens(client, address);
      set({ nftokens: nftokens });
    };
    const _burnNftoken = _mintNftoken;
    set({ _mintNftoken: _mintNftoken });
    set({ _burnNftoken: _burnNftoken });

    if (networkEmitter) {
      networkEmitter.on(address, WalletEvents.TokenMint, _mintNftoken);
      networkEmitter.on(address, WalletEvents.TokenBurn, _burnNftoken);
      networkEmitter.on(address, WalletEvents.AcceptBuyOffer, _acceptBuyOffer);
      networkEmitter.on(
        address,
        WalletEvents.AcceptSellOffer,
        _acceptSellOffer,
      );
    }

    set({ isOnEvent: isOnEvent });
  },
  disableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    const _acceptBuyOffer = get()._acceptBuyOffer;
    const _acceptSellOffer = get()._acceptSellOffer;
    const _mintNftoken = get()._mintNftoken;
    const _burnNftoken = get()._burnNftoken;
    if (!isOnEvent) return;

    if (
      _acceptBuyOffer === null ||
      _acceptSellOffer === null ||
      _mintNftoken === null ||
      _burnNftoken === null ||
      networkEmitter === null
    )
      return;

    console.debug('added balance listener for ', address);

    networkEmitter.off(address, WalletEvents.TokenMint, _mintNftoken);
    networkEmitter.off(address, WalletEvents.TokenBurn, _burnNftoken);
    networkEmitter.off(address, WalletEvents.AcceptBuyOffer, _acceptBuyOffer);
    networkEmitter.off(address, WalletEvents.AcceptSellOffer, _acceptSellOffer);

    set({ isOnEvent: isOnEvent });
  },
}));
