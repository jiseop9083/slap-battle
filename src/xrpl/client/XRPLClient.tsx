import { useEffect } from 'react';
import { NETWORKS } from '@/xrpl/constants';
import { useClient } from '@/hooks/useClient';

interface IXRPLClientProps {
  children: React.ReactNode;
  network?: string;
}
/**
 * Creates an XRPL client with the specified network and provides it to its children components.
 */
export const XRPLClient = ({
  children,
  network = NETWORKS.TESTNET,
}: IXRPLClientProps) => {
  const { connect, disconnect } = useClient(network);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return <>{children}</>;
};
