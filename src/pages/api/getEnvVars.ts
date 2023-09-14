import type { NextApiRequest, NextApiResponse } from 'next';
import { clusterApiUrl, Cluster } from '@solana/web3.js';

type ResponseData = {
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { action, network, publicKey } = req.query;

    const clusterMapping: { [key: string]: Cluster } = {
      'devnet': 'devnet',
      'mainnet-beta': 'mainnet-beta',
    };

    if (action === 'fetchManifest') {
      const apiURL = 
        network === 'devnet' ? process.env.NEXT_PUBLIC_DEVNET_RPC :
        network === 'mainnet-beta' ? process.env.NEXT_PUBLIC_MAINNET_RPC :
        clusterApiUrl(clusterMapping[network as string]);

      const response = await fetch(`${apiURL}?publicKey=${publicKey}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      res.status(200).json({ data });
    } else if (action === 'getEnvVars') {
      res.status(200).json({
        data: {
          referrerTrgDevnet: process.env.NEXT_PUBLIC_REFERRER_TRG_DEVNET,
          referrerTrgMainnet: process.env.NEXT_PUBLIC_REFERRER_TRG_MAINNET,
          referrerBps: process.env.NEXT_PUBLIC_REFERRER_BPS,
        },
      });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
