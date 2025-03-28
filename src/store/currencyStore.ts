import { NetworkEmitter, WalletEvents } from '@/api/networkEmitter';
import { getBalances } from '@/api/requests/getBalances';
import { createStore } from '@/store/store';
import { Client as xrplClient } from 'xrpl';
import { Currency } from '@/types/wallet';

type State = {
  client: xrplClient | null;
  networkEmitter: NetworkEmitter | null;
  isOnEvent: boolean;
  // Wallet
  currencies: Currency[];
};

type Action = {
  setClient: (client: xrplClient) => void;
  setNetworkEmitter: (networkEmitter: NetworkEmitter) => void;
  // functions of event callback
  _changeCurrency: (() => Promise<void>) | null;
  // functions for Wallet
  fetchCurrecy: (address: string) => Promise<void>;
  enableEvents: (address: string) => void;
  disableEvents: (address: string) => void;
};
type Store = State & Action;

export const useCurrencyStore = createStore<Store>((set, get) => ({
  client: null,
  networkEmitter: null,
  isOnEvent: false,
  // Wallet
  currencies: [],
  setClient: (client) => set({ client: client }),
  setNetworkEmitter: (networkEmitter) =>
    set({ networkEmitter: networkEmitter }),
  // functions of event callback
  _changeCurrency: null,
  // fuctions for Wallet
  fetchCurrecy: async (address) => {
    const client = get().client;
    if (!client) return;
    const [, currencies] = await getBalances(client, address);
    set({ currencies: currencies });
  },
  enableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    const client = get().client;
    if (!client) return '';

    const _changeCurrency = () => {
      getBalances(client, address).then(([, currencies]) => {
        set({ currencies: currencies });
      });
    };

    if (isOnEvent) {
      return;
    }

    console.debug('added balance listener for ', address);

    if (networkEmitter) {
      networkEmitter.on(address, WalletEvents.CurrencyChange, _changeCurrency);
    }

    set({ isOnEvent: isOnEvent });
  },
  disableEvents: (address) => {
    const isOnEvent = get().isOnEvent;
    const networkEmitter = get().networkEmitter;
    const _changeCurrency = get()._changeCurrency;
    if (!isOnEvent) return;

    if (_changeCurrency === null || networkEmitter === null) return;

    console.debug('added balance listener for ', address);

    networkEmitter.off(address, WalletEvents.CurrencyChange, _changeCurrency);

    set({ isOnEvent: isOnEvent });
  },
}));
