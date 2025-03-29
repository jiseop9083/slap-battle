import { createAndFundWallet, createWallet } from '@/api/createWallet';
import { useClientStore } from '@/store/clientStore';

import { Wallet } from 'xrpl';

export const useCreateWallet = () => {
  const client = useClientStore((state) => state.client);

  const create = (seed?: string): Wallet => {
    return createWallet(seed);
  };

  const createWithFund = async (amount: string) => {
    if (!client) return Promise.reject('not connected');
    return await createAndFundWallet(client, amount);
  };
  return { create, createWithFund };
};
