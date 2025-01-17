import React, { ReactNode, createContext, useContext, useState } from "react";
import dexterityTs from '@hxronetwork/dexterity-ts'
import { useNetworkConfiguration } from "./NetworkConfigurationProvider";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
export const dexterity = dexterityTs

interface ManifestContextProps {
  manifest: InstanceType<typeof dexterity.Manifest>;
  setManifest: React.Dispatch<React.SetStateAction<InstanceType<typeof dexterity.Manifest>>>;
}

const ManifestContext = createContext<ManifestContextProps | undefined>(undefined);

export const ManifestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [manifest, setManifest] = useState(null);

  return (
    <ManifestContext.Provider value={{ manifest, setManifest }}>
      {children}
    </ManifestContext.Provider>
  );
};

export const useManifest = () => {
  const context = useContext(ManifestContext);
  if (!context) {
    throw new Error("useManifest must be used within a ManifestProvider");
  }
  return context;
};

type BigNumber = {
  m: string;
  exp: string;
  _isNan: boolean;
};

type OrderData = {
  id: string;
  productName: string;
  productIndex: number;
  price: BigNumber;
  qty: BigNumber;
  isBid: boolean;
};

interface TraderContextProps {
  trader: InstanceType<typeof dexterity.Trader>;
  setTrader: React.Dispatch<React.SetStateAction<InstanceType<typeof dexterity.Trader>>>;
  cashBalance: number;
  setCashBalance: React.Dispatch<React.SetStateAction<number>>;
  openPositionsValue: number;
  setOpenPositionsValue: React.Dispatch<React.SetStateAction<number>>;
  portfolioValue: number;
  setPortfolioValue: React.Dispatch<React.SetStateAction<number>>;
  initialMarginReq: number;
  setInitialMarginReq: React.Dispatch<React.SetStateAction<number>>;
  maintananceMarginReq: number;
  setMaintananceMarginReq: React.Dispatch<React.SetStateAction<number>>;
  accountLeverage: number;
  setAccountLeverage: React.Dispatch<React.SetStateAction<number>>;
  accountHealth: string;
  setAccountHealth: React.Dispatch<React.SetStateAction<string>>;
  allTimePnl: number;
  setAllTimePnl: React.Dispatch<React.SetStateAction<number>>;
  updated: boolean;
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  lastUpdated: number;
  setLastUpdated: React.Dispatch<React.SetStateAction<number>>;
  orderData: OrderData[];
  setOrderData: React.Dispatch<React.SetStateAction<OrderData[]>>;
}

const TraderContext = createContext<TraderContextProps | undefined>(undefined);

export const TraderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [trader, setTrader] = useState(null);
  const [cashBalance, setCashBalance] = useState(null);
  const [openPositionsValue, setOpenPositionsValue] = useState(null);
  const [portfolioValue, setPortfolioValue] = useState(null);  
  const [initialMarginReq, setInitialMarginReq] = useState(null); 
  const [maintananceMarginReq, setMaintananceMarginReq] = useState(null); 
  const [accountHealth, setAccountHealth] = useState(null);
  const [accountLeverage, setAccountLeverage] = useState(null);  
  const [allTimePnl, setAllTimePnl] = useState(null); 
  const [updated, setUpdated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [orderData, setOrderData] = useState(null);

  return (
    <TraderContext.Provider value={
      {
        trader,
        setTrader,
        cashBalance,
        setCashBalance,
        openPositionsValue,
        setOpenPositionsValue,
        portfolioValue,
        setPortfolioValue,
        initialMarginReq,
        setInitialMarginReq,
        maintananceMarginReq,
        setMaintananceMarginReq,
        accountHealth,
        setAccountHealth,
        accountLeverage,
        setAccountLeverage,
        allTimePnl,
        setAllTimePnl,
        updated,
        setUpdated,
        lastUpdated,
        setLastUpdated,
        orderData,
        setOrderData
      }
    }>
      {children}
    </TraderContext.Provider>
  );
};

export const useTrader = () => {
  const context = useContext(TraderContext);
  if (!context) {
    throw new Error("useTrader must be used within a TraderProvider");
  }
  return context;
};

export interface Product {
  index: number;
  name: string;
  minSize: number;
  exponent: number
}

interface ProductContextProps {
  mpgPubkey: string;
  setMpgPubkey: React.Dispatch<React.SetStateAction<string>>;
  selectedProduct: Product;
  setSelectedProductIndex: React.Dispatch<React.SetStateAction<Product>>;
  indexPrice: number;
  setIndexPrice: React.Dispatch<React.SetStateAction<number>>;
  markPrice: number;
  setMarkPrice: React.Dispatch<React.SetStateAction<number>>;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;

  // if (devnet) BITCCOIN MPG; else if (mainnet) MAJORS MPG
  let defaultMpg =
    network == 'devnet' ? 'HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB' :
      network == 'mainnet-beta' ? '4cKB5xKtDpv4xo6ZxyiEvtyX3HgXzyJUS1Y8hAfoNkMT' : null;

  let defaultProduct: Product = {
    index: 0,
    name: 'BTCUSD-PERP',
    minSize: 0.0001,
    exponent: 4,
  }

  const [mpgPubkey, setMpgPubkey] = useState(defaultMpg)
  const [selectedProduct, setSelectedProductIndex] = useState(defaultProduct)
  const [indexPrice, setIndexPrice] = useState(0)
  const [markPrice, setMarkPrice] = useState(0)

  return (
    <ProductContext.Provider value={{ mpgPubkey, setMpgPubkey, selectedProduct, setSelectedProductIndex, indexPrice, setIndexPrice, markPrice, setMarkPrice }}>
      {children}
    </ProductContext.Provider>
  );

}

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};