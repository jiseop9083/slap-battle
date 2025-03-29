import { useWalletStore } from '@/store/useWalletStore';

export const WalletInfo = () => {
  const address = useWalletStore((state) => state.address);

  return <div className="WalletRow">Address: {address}</div>;
};
