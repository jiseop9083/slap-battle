import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Client as xrplClient } from 'xrpl';
import { NETWORKS } from '@/xrpl/constants';
import { useClientStore } from '@/store/clientStore';
import { createNetworkEmitter } from '@/api/networkEmitter';
import { useBalanceStore } from '@/store/balanceStore';
import { useBuyOfferStore } from '@/store/buyOfferStore';
import { useSellOfferStore } from '@/store/sellOfferStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useNftokenStore } from '@/store/nftokenStore';

export const useClient = (network: string = NETWORKS.TESTNET) => {
  const isConnected = useClientStore((state) => state.isConnected);
  const setIsConnected = useClientStore((state) => state.setIsConnected);
  const setClient = useClientStore((state) => state.setClient);
  const setNetworkEmitter = useClientStore((state) => state.setNetworkEmitter);
  const setClientBalance = useBalanceStore((state) => state.setClient);
  const setNetworkEmitterBanlance = useBalanceStore(
    (state) => state.setNetworkEmitter,
  );
  const setClientBuyOffer = useBuyOfferStore((state) => state.setClient);
  const setNetworkEmitterBuyOffer = useBuyOfferStore(
    (state) => state.setNetworkEmitter,
  );
  const setClientSellOffer = useSellOfferStore((state) => state.setClient);
  const setNetworkEmitterSellOffer = useSellOfferStore(
    (state) => state.setNetworkEmitter,
  );
  const setClientCurrency = useCurrencyStore((state) => state.setClient);
  const setNetworkEmitterCurrency = useCurrencyStore(
    (state) => state.setNetworkEmitter,
  );
  const setClientNftoken = useNftokenStore((state) => state.setClient);
  const setNetworkEmitterNftoken = useNftokenStore(
    (state) => state.setNetworkEmitter,
  );

  const isConnectedRef = useRef<boolean>(isConnected);

  const client = useMemo(() => new xrplClient(network), [network]);

  const networkEmitter = useMemo(() => {
    return createNetworkEmitter(client);
  }, [client]);

  useEffect(() => {
    const unsubscribe = useClientStore.subscribe(({ isConnected }) => {
      isConnectedRef.current = isConnected;
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setNetworkEmitter(networkEmitter);
    setNetworkEmitterBanlance(networkEmitter);
    setNetworkEmitterSellOffer(networkEmitter);
    setNetworkEmitterBuyOffer(networkEmitter);
    setNetworkEmitterBanlance(networkEmitter);
    setNetworkEmitterCurrency(networkEmitter);
    setNetworkEmitterNftoken(networkEmitter);

    if (isConnected) {
      networkEmitter.start();
    }

    return () => {
      if (isConnected) {
        networkEmitter.stop();
      }
    };
  }, [networkEmitter, isConnected, setNetworkEmitter]);

  const connect = useCallback(() => {
    console.debug('connecting...');
    client.connect();
    console.log(client);
    setClient(client);
    setClientBalance(client);
    setClientSellOffer(client);
    setClientBuyOffer(client);
    setClientCurrency(client);
    setClientNftoken(client);

    const onConnected = () => {
      console.debug('connected');
      setIsConnected(true);
    };

    const onDisconnected = () => {
      console.debug('disconnected');
      setIsConnected(false);
    };

    client.on('connected', onConnected);
    client.on('disconnected', onDisconnected);

    return () => {
      console.debug('disconnecting...');
      setIsConnected(false);

      client.off('connected', onConnected);
      client.off('disconnected', onDisconnected);

      client.disconnect();
    };
  }, [client, setClient, setIsConnected]);

  const disconnect = useCallback(() => {
    console.debug('Disconnecting from the network...');
    client.disconnect();
    setIsConnected(false);
    networkEmitter.stop();
  }, [client, networkEmitter, setIsConnected]);

  return { connect, disconnect };
};
