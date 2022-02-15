export type ConnectionData = {
  isAuthenticated: boolean;
  wallet: Wallet;
};

export type Wallet = {
  isEth: boolean;
  address: string;
};
