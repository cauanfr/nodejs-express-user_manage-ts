import { IUser } from "./interfaces";

const users: IUser[] = Array.from(Array(20)).map((_, i) => {
  return {
    id: i + 1,
    email: `mail${i}@mail.com`,
    age: null,
    cpf: `${i}`.padEnd(11, "0"),
  };
});

export default users;
