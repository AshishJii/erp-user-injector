export type User = {
    name: string;
    roll: string;
    branch: string;
    section: string;
    email: string;
  };
  
export type LoginResponse = {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
};

export type TokenStoreRecord = {
  username: string;
  password: string;
};

export type TokenInfo = {
  username: string;
  token: string;
};