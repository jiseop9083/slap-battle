import { NetworkEmitter } from '@/api/networkEmitter';

import { createStore } from '@/store/store';
import { Client as xrplClient } from 'xrpl';

type State = {
  isConnected: boolean;
  client: xrplClient | null;
  networkEmitter: NetworkEmitter | null;
  isOnEvent: boolean;
};

type Action = {
  setIsConnected: (isConnected: boolean) => void;
  setClient: (client: xrplClient) => void;
  setNetworkEmitter: (networkEmitter: NetworkEmitter) => void;
};
type Store = State & Action;

export const useClientStore = createStore<Store>((set) => ({
  isConnected: false,
  client: null,
  networkEmitter: null,
  isOnEvent: false,
  // Wallet
  balance: '',
  buyOffersByTokenId: {},
  sellOffersByTokenId: {},
  currencies: [],
  nftokens: [],
  setIsConnected: (isConnected) => set({ isConnected: isConnected }),
  setClient: (client) => set({ client: client }),
  setNetworkEmitter: (networkEmitter) =>
    set({ networkEmitter: networkEmitter }),
}));
