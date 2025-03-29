import { useClientStore } from '@/store/clientStore';
import '@/style/index.css';
import { CreateSourceWallet } from '@/components/wallet/CreateSourceWallet';
import { SourceWallet } from '@/components/wallet/SourceWallet';
import { NETWORKS } from '@/xrpl/constants';
import { XRPLClient } from '@/xrpl/client/XRPLClient';
import { ChargeMoney } from '@/components/wallet/charge/ChargeMoney';

const MainApp = () => {
  // The useIsConnected hook will let you know
  // when the client has connected to the xrpl network
  const isConnected = useClientStore((state) => state.isConnected);
  return (
    <div className="MainApp">
      <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
      <ChargeMoney />
      <div className="m-auto">
        <CreateSourceWallet>
          <SourceWallet />
        </CreateSourceWallet>
      </div>
      {/* <div className="WalletWrapper">
          <CreateDestinationWallet>
            <DestinationWallet />
          </CreateDestinationWallet>
        </div> */}
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <XRPLClient network={NETWORKS.TESTNET}>
        <MainApp />
      </XRPLClient>
    </div>
  );
};

export default App;
