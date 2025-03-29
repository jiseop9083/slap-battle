import { useBalanceStore } from '@/store/balanceStore';

export const WalletBalance = () => {
  const balance = useBalanceStore((state) => state.balance);

  return <div className="WalletRow">Balance: {balance}</div>;
};
