import { createStore } from '@/store/store';
import { Wallet as xrplWallet } from 'xrpl';

type State = {
  address: string;
  wallet: xrplWallet | null;
};

type Action = {
  setAddress: (address: string) => void;
  setWallet: (wallet: xrplWallet) => void;
};

type Store = State & Action;

export const useWalletStore = createStore<Store>((set) => ({
  address: '',
  wallet: null,
  setAddress: (address) => set({ address: address }),
  setWallet: (wallet) => set({ wallet: wallet, address: wallet.address }),
}));
