import { useWalletStore } from '@/store/useWalletStore';

export const WalletSeed = () => {
  const wallet = useWalletStore((state) => state.wallet);

  return <div className="WalletRow">Seed: {wallet?.seed ?? 'NA'}</div>;
};
