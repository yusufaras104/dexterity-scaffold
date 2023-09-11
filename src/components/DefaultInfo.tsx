import { useTrader } from "contexts/DexterityProviders";
import { FC, useEffect } from "react";
import { formatPubKey } from 'utils/util';

export const DefaultInfo: FC = () => {
    const { mpgPubkey, selectedProduct } = useTrader()

    useEffect(() => {}, [mpgPubkey, selectedProduct])

    return (
        <>Mpg PubKey: {formatPubKey(mpgPubkey)} | Product: {selectedProduct.name} | Min. Trade Size: {selectedProduct.minSize}</>    
    )
}