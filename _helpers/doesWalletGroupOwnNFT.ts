export const doesWalletGroupOwnNFT = async (
  getNFTBalances: any,
  walletGroupID: string,
  communityId: string,
  updateWalletGroupOwnsNFT: (hasRequiredNft: boolean) => void
) => {
  // const walletAddresses = await getAddressesInWalletGroup(walletGroupID);
  // updateWalletGroupOwnsNFT(true);
  // let tokenAddressesInWallets: string[] = [];
  // await Promise.all(
  //   walletAddresses.map(async (walletAddress) => {
  //     if (Web3.utils.isAddress(walletAddress)) {
  //       const nftsInWalletResponse = await getNFTBalances({
  //         params: {
  //           chain: '0x1',
  //           address: walletGroupID,
  //         },
  //       });
  //       nftsInWalletResponse.result.map((nft: any) =>
  //         tokenAddressesInWallets.push(nft.token_address)
  //       );
  //     } else {
  //       try {
  //         let pubkey = new PublicKey(walletGroupID);
  //         PublicKey.isOnCurve(pubkey.toBuffer());
  //         const nftsInWallet: any = await getParsedNftAccountsByOwner({
  //           publicAddress: walletGroupID,
  //           connection: new Connection(mainNetUrl),
  //         });
  //         nftsInWallet.map((nft: any) =>
  //           tokenAddressesInWallets.push(nft.mint)
  //         );
  //       } catch (error) {}
  //     }
  //   })
  // );
  // let filteredTokenAddresses = [...new Set(tokenAddressesInWallets)];
  // let hasRequiredNft = false;
  // await Promise.all(
  //   filteredTokenAddresses.map(async (tokenAddress: any) => {
  //     if (await checkCommunityIdMatchesAddress(communityId, tokenAddress)) {
  //       hasRequiredNft = true;
  //     }
  //   })
  // );
  // if (!hasRequiredNft) {
  //   const stakingCommunityInfo = await checkForStakingAddresses(communityId);
  //   await Promise.all(
  //     walletAddresses.map(async (walletAddress) => {
  //       if (Web3.utils.isAddress(walletAddress)) {
  //         await Promise.all(
  //           stakingCommunityInfo.map(async (stakingCommunity) => {
  //             if (
  //               await checkIfUserStillHasStakedNft(
  //                 walletAddress,
  //                 stakingCommunity.tokenAddress,
  //                 stakingCommunity.stakingAddress
  //               )
  //             ) {
  //               hasRequiredNft = true;
  //             }
  //           })
  //         );
  //       }
  //     })
  //   );
  // }
  // updateHasRequiredNft(hasRequiredNft);
};
