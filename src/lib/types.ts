export type User = {
  name: string;
  roll: string;
  branch: string;
  section: string;
  email: string;
  mobile: string;
  birthDate: string;
  libraryCode: string;
  localAddress: string;
  permanentAddress: string;
}
  
export type LoginResponse =
  | {
      status: "success";
      data: { user: User; token: string; };
    }
  | {
      status: "error";
      msg: string;
    };

export type TokenStoreRecord = {
  username: string;
  password: string;
};

export type TokenInfo = {
  username: string;
  token: string;
};

export type ERPLoginResponse =
  | { status: "success"; data: User }
  | { status: "error"; msg: string };