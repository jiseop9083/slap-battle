import { NetworkEmitter, WalletEvents } from '@/api/networkEmitter';
import { getBalances } from '@/api/requests/getBalances';
import { createStore } from '@/store/store';
import { Client as xrplClient } from 'xrpl';

type State = {
  client: xrplClient | null;
  networkEmitter: NetworkEmitter | null;
  isOnEvent: boolean;
  // Wallet
  balance: number;
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
  balance: 0,
  setClient: (client) => set({ client: client }),
  setNetworkEmitter: (networkEmitter) =>
    set({ networkEmitter: networkEmitter }),
  // functions of event callback
  _changeBalance: null,
  // fuctions for Wallet
  fetchBalance: async (address) => {
    const client = get().client;
    console.log(client, address, 'cccccc');
    if (!client) return '';
    const [balance] = await getBalances(client, address);
    console.log(balance, 'balsdjfl');
    const bal = parseInt(balance, 10);
    set({ balance: isNaN(bal) ? 0 : bal });
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
      console.log('ddddd');
      set({ balance: xrp });
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
