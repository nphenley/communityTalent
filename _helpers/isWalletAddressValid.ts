import { PublicKey } from '@solana/web3.js';
import Web3 from 'web3';

export const isWalletAddressValid = (walletAddress: string) => {
  // Check if valid ETH Address
  if (Web3.utils.isAddress(walletAddress)) return 'eth';
  // Check if valid SOL Address
  try {
    let pubkey = new PublicKey(walletAddress);
    PublicKey.isOnCurve(pubkey.toBuffer());
    return 'sol';
  } catch (error) {
    return false;
  }
};
