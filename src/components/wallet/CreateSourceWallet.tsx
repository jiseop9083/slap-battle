import { useCreateWallet } from '@/hooks/useWallet';
import { useBalanceStore } from '@/store/balanceStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useState } from 'react';

interface ICreateSourceWalletProps {
  children: React.ReactNode;
}
export const CreateSourceWallet = ({ children }: ICreateSourceWalletProps) => {
  const [seed, setSeed] = useState('');
  const [sending, setSending] = useState(false);

  const { createWithFund } = useCreateWallet();
  const setWallet = useWalletStore((state) => state.setWallet);
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);

  const handleClickCreationButton = async () => {
    setSending(true);
    const initialState = await createWithFund('1000');
    setSending(false);

    if (initialState.seed) {
      console.debug('created wallet: ', initialState);
      setSeed(initialState.seed);
      setWallet(initialState);
      await fetchBalance(initialState.address);
    }
  };

  return seed ? (
    <>{children}</>
  ) : (
    <div>
      {!sending ? (
        <button onClick={handleClickCreationButton} className="button-info">
          Create source wallet
        </button>
      ) : (
        'Creating source wallet...'
      )}
    </div>
  );
};
