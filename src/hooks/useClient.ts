import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Client as xrplClient } from 'xrpl';
import { NETWORKS } from '@/xrpl/constants';
import { useClientStore } from '@/store/clientStore';
import { createNetworkEmitter } from '@/api/networkEmitter';

export const useClient = (network: string = NETWORKS.TESTNET) => {
  const { isConnected, setIsConnected, setClient, setNetworkEmitter } =
    useClientStore((state) => ({
      isConnected: state.isConnected,
      setIsConnected: state.setIsConnected,
      setClient: state.setClient,
      setNetworkEmitter: state.setNetworkEmitter,
    }));

  useEffect(() => {
    const unsubscribe = useClientStore.subscribe(({ isConnected }) => {
      isConnectedRef.current = isConnected;
    });
    return unsubscribe;
  }, []);

  const isConnectedRef = useRef<boolean>(isConnected);

  const client = useMemo(() => new xrplClient(network), [network]);

  const networkEmitter = useMemo(() => {
    return createNetworkEmitter(client);
  }, [client]);

  const connect = useCallback(() => {
    console.debug('connecting...');
    client.connect();
    setClient(client);

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

  useEffect(() => {
    setNetworkEmitter(networkEmitter);
    if (isConnected) {
      networkEmitter.start();
    }

    return () => {
      if (isConnected) {
        networkEmitter.stop();
      }
    };
  }, [networkEmitter, isConnected, setNetworkEmitter]);

  return { connect, disconnect };
};
