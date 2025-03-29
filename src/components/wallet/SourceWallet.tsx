import { SendXrp } from '@/components/wallet/sendXrp';
import { WalletBalance } from '@/components/wallet/walletBalance';
import { WalletInfo } from '@/components/wallet/walletInfo';
import { WalletSeed } from '@/components/wallet/walletSeed';

export const SourceWallet = () => {
  return (
    <div className="flex flex-col items-start">
      <div className="text-red-500">Source Wallet</div>
      <WalletSeed />
      <WalletInfo />
      <WalletBalance />
      <SendXrp />
    </div>
  );
};
