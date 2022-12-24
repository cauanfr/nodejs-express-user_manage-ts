interface IUser {
  id: number;
  email: string;
  cpf: string;
  age?: number | null;
}

interface IUserCreateRequest {
  email: string;
  cpf: string;
  age?: number | null;
}

interface IUserUpdateRequest {
  email?: string;
  cpf?: string;
  age?: number | null;
}

interface IPagination {
  prevPage?: number | null;
  nextPage?: number | null;
  users: IUser[];
}

type IUserRequest = IUserCreateRequest | IUserUpdateRequest;

export {
  IUser,
  IUserCreateRequest,
  IUserUpdateRequest,
  IUserRequest,
  IPagination,
};
