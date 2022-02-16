export type ConnectionData = {
  wallet: Wallet;
  profileId: string | undefined;
};

export type Wallet = {
  isEth: boolean;
  address: string;
};
