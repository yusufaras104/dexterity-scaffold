import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import {
    UnsafeBurnerWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { Cluster, clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, createContext, useCallback, useMemo, useState } from 'react';
import { AutoConnectProvider, useAutoConnect } from './AutoConnectProvider';
import { notify } from "../utils/notifications";
import { NetworkConfigurationProvider, useNetworkConfiguration } from './NetworkConfigurationProvider';
import dynamic from "next/dynamic";
import dexterityTs, { DexterityWallet } from '@hxronetwork/dexterity-ts';
import { ManifestProvider, useManifest, TraderProvider } from './DexterityProviders';
export const dexterity = dexterityTs

const ReactUIWalletModalProviderDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
    { ssr: false }
);

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { autoConnect } = useAutoConnect();
    const { networkConfiguration } = useNetworkConfiguration();
    const network = networkConfiguration as WalletAdapterNetwork;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const { setManifest } = useManifest();
    const { publicKey, signTransaction, signAllTransactions } = useWallet()

    const wallets = useMemo(
        () => [
            new UnsafeBurnerWalletAdapter(),
        ],
        [network]
    );


    const onError = useCallback(
        (error: WalletError) => {
            notify({ type: 'error', message: error.message ? `${error.name}: ${error.message}` : error.name });
            console.error(error);
        },
        []
    );

    useMemo(async () => {
        const DexWallet: DexterityWallet = {
            publicKey: publicKey!,
            signTransaction,
            signAllTransactions,
        }
        console.log({DexWallet})
        const rpc = network == 'devnet'? process.env.NEXT_PUBLIC_DEVNET_RPC! : network == 'mainnet-beta'? process.env.NEXT_PUBLIC_MAINNET_RPC! : clusterApiUrl(network)
        const manifest = await dexterity.getManifest(rpc, true, DexWallet);
        console.log('Manifest: ', manifest)
        setManifest(manifest);
    }, [publicKey]);

    return (
        // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
                <ReactUIWalletModalProviderDynamic>
                    {children}
                </ReactUIWalletModalProviderDynamic>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {

    return (
        <>
            <NetworkConfigurationProvider>
                <AutoConnectProvider>
                    <ManifestProvider>
                        <TraderProvider>
                            <WalletContextProvider>
                                {children}
                            </WalletContextProvider>
                        </TraderProvider>
                    </ManifestProvider>
                </AutoConnectProvider>
            </NetworkConfigurationProvider>
        </>
    );
};