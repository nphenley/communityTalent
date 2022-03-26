import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection, PublicKey } from '@solana/web3.js';
import { mainNetUrl } from '_constants/solanaConstants';
import { getCommunitiesByTokenAddress } from '_api/communities';
import { Community } from '_types/Community';
import Web3 from 'web3';
import { getAddressesInWalletGroup } from '_api/walletGroups';

export const getWalletCommunities = async (getNFTBalances: any, walletGroupID: string): Promise<Community[]> => {
  const walletAddresses = await getAddressesInWalletGroup(walletGroupID);
  const tokenAddresses: string[] = [];
  const communitiesToReturn: Community[] = [];

  await Promise.all(
    walletAddresses.map(async (walletAddress) => {
      if (Web3.utils.isAddress(walletAddress)) {
        const evmNFTTokenAddresses = await getEVMNFTTokenAddressesFromWallet('0x1', walletAddress, getNFTBalances);
        evmNFTTokenAddresses.forEach((tokenAddress) => tokenAddresses.push(tokenAddress));
      } else {
        let pubkey = new PublicKey(walletAddress);
        PublicKey.isOnCurve(pubkey.toBuffer());
        const solanaNFTTokenAddresses = await getSolanaNFTTokenAddressesFromWallet(walletAddress);
        solanaNFTTokenAddresses.forEach((tokenAddress) => tokenAddresses.push(tokenAddress));
      }
    })
  );

  await Promise.all(
    tokenAddresses.map(async (tokenAddress) => {
      const communities = await getCommunitiesByTokenAddress(tokenAddress);
      communities.forEach((community) => {
        if (!communitiesToReturn.find((elem) => elem.id === community.id)) communitiesToReturn.push(community);
      });
    })
  );
  return communitiesToReturn;
};

const getSolanaNFTTokenAddressesFromWallet = async (walletAddress: string): Promise<string[]> => {
  const nftsInWallet = await getParsedNftAccountsByOwner({
    publicAddress: walletAddress,
    connection: new Connection(mainNetUrl),
  });
  return nftsInWallet.map((nft) => nft.mint);
};

const getEVMNFTTokenAddressesFromWallet = async (chainId: string, walletAddress: string, getNFTBalances: any): Promise<string[]> => {
  const nftsInWallet = await getNFTBalances({ params: { chain: chainId, address: walletAddress } });
  return nftsInWallet.result.map((nft: any) => nft.token_address);
};
