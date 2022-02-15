export type ConnectionData = {
  isAuthenticated: boolean;
  wallet: Wallet;
  profileId: string;
};

export type Wallet = {
  isEth: boolean;
  address: string;
};
