export const checkIfUserStillHasStakedNft = async (walletGroupID: string, tokenAddress: string, stakingAddress: string) => {
  // const userTransfersOfNft = await getNFTTransfers(walletGroupID, tokenAddress);

  // let unstakedNftIds: string[] = [];

  // userTransfersOfNft.forEach((transfer: any) => {
  //   if (transfer.from === stakingAddress && transfer.to === walletGroupID) unstakedNftIds.push(transfer.tokenID);
  //   if (transfer.to === stakingAddress && transfer.from === walletGroupID && !unstakedNftIds.includes(transfer.tokenID)) {
  //     return true;
  //   }
  // });
  return false;
};
