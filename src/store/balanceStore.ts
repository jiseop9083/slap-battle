import { NetworkEmitter, WalletEvents } from '@/api/networkEmitter';
import { getBalances } from '@/api/requests/getBalances';
import { createStore } from '@/store/store';
import { Client as xrplClient } from 'xrpl';

type State = {
  client: xrplClient | null;
  networkEmitter: NetworkEmitter | null;
  isOnEvent: boolean;
  // Wallet
  balance: string;
};

type Action = {
  setClient: (client: xrplClient) => void;
  setNetworkEmitter: (networkEmitter: NetworkEmitter) => void;
  // functions of event callback
  _changeBalance: ((drop: string, xrp: number) => void) | null;
  // functions for Wallet
  fetchBalance: (address: string) => Promise<string>;
  enableEvents: (address: string) => void;
  disableEvents: (address: string) => void;
};
type Store = State & Action;

export const useBalanceStore = createStore<Store>((set, get) => ({
  client: null,
  networkEmitter: null,
  isOnEvent: false,
  // Wallet
  balance: '',
  setClient: (client) => set({ client: client }),
  setNetworkEmitter: (networkEmitter) =>
    set({ networkEmitter: networkEmitter }),
  // functions of event callback
  _changeBalance: null,
  // fuctions for Wallet
  fetchBalance: async (address) => {
    const client = get().client;
    if (!client) return '';
    const [balance] = await getBalances(client, address);
    set({ balance: balance });
    return balance;
  },
  enableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    if (isOnEvent) {
      return;
    }

    console.debug('added balance listener for ', address);

    const _changeBalance = (drop: string, xrp: number) => {
      set({ balance: `${xrp}` });
    };

    if (networkEmitter) {
      networkEmitter.on(address, WalletEvents.BalanceChange, _changeBalance);
    }

    set({ isOnEvent: isOnEvent });
  },
  disableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    const _changeBalance = get()._changeBalance;
    if (!isOnEvent) return;

    if (_changeBalance === null || networkEmitter === null) return;

    console.debug('added balance listener for ', address);
    if (networkEmitter) {
      networkEmitter.off(address, WalletEvents.BalanceChange, _changeBalance);
    }

    set({ isOnEvent: isOnEvent });
  },
}));
