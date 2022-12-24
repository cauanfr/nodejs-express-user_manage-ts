import { SchemaOf, number, object, string, array } from "yup";
import {
  IUserCreateRequest,
  IUserUpdateRequest,
  IUser,
  IPagination,
} from "./interfaces";

const userCreateRequestSerializer: SchemaOf<IUserCreateRequest> =
  object().shape({
    email: string().email().required(),
    cpf: string().min(11).max(11).required(),
    age: number()
      .positive()
      .nullable()
      .default((val: any) => (val ? val : null))
      .optional(),
  });

const userUpdateRequestSerializer: SchemaOf<IUserUpdateRequest> =
  object().shape({
    email: string().email().optional(),
    cpf: string().min(11).max(11).optional(),
    age: number()
      .positive()
      .nullable()
      .default((val: any) => (val ? val : null))
      .optional(),
  });

const userResponseSerializer: SchemaOf<IUser> = object().shape({
  cpf: string()
    .transform((val: string) => val.slice(0, 3).padEnd(11, "*"))
    .required(),
  age: number().positive().nullable().optional(),
  email: string().email().required(),
  id: number().positive().required(),
});

const usersResponseSerializer: SchemaOf<IUser[]> = array().of(
  userResponseSerializer
);

const paginationResponseSerializer: SchemaOf<IPagination> = object().shape({
  users: usersResponseSerializer,
  nextPage: number()
    .positive()
    .default((val: any) => (val ? val : null))
    .nullable()
    .optional(),
  prevPage: number()
    .positive()
    .default((val: any) => (val ? val : null))
    .nullable()
    .optional(),
});

export {
  userCreateRequestSerializer,
  userUpdateRequestSerializer,
  userResponseSerializer,
  usersResponseSerializer,
  paginationResponseSerializer,
};
