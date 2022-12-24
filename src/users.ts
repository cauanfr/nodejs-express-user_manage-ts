import { Request, Response } from "express";
import {
  userResponseSerializer,
  paginationResponseSerializer,
} from "./serializers";
import {
  IUserCreateRequest,
  IUser,
  IUserUpdateRequest,
  IPagination,
} from "./interfaces";
import users from "./database";
import { ParsedQs } from "qs";

const getUserId = (): number => {
  if (!users.length) return 1;

  const sortedById = users.sort((a, b) => a.id - b.id);
  const [lastUser] = sortedById.slice(-1);

  return lastUser.id + 1;
};

const pagination = (query: ParsedQs): IPagination | boolean => {
  const queryKeys = Object.keys(query);
  let page: number;
  let perPage: number;

  if (!queryKeys.includes("page") || typeof query.page !== "string") {
    page = 1;
  } else {
    const queryPage = parseInt(query.page);
    page = queryPage > 0 ? queryPage : 5;
  }

  if (!queryKeys.includes("perPage") || typeof query.perPage !== "string") {
    perPage = 5;
  } else {
    const queryPerPage = parseInt(query.perPage);
    perPage = queryPerPage > 0 ? queryPerPage : 1;
  }

  if (isNaN(page) || isNaN(perPage)) {
    return false;
  }

  const selectedPage = (page - 1) * perPage;
  const selectedPerPage = page * perPage;
  const totalSelected = page * perPage;

  const slicedUsers = users.slice(selectedPage, selectedPerPage);

  const prevPage = page <= 1 ? null : page - 1;
  const nextPage = totalSelected >= users.length ? null : page + 1;

  return {
    prevPage,
    nextPage,
    users: slicedUsers,
  };
};

const createUser = async (req: Request, res: Response): Promise<Response> => {
  const validatedBody = req.validatedBody as IUserCreateRequest;
  const user: IUser = { ...validatedBody, id: getUserId() };

  users.push(user);

  const userResponse = await userResponseSerializer.validate(user, {
    stripUnknown: true,
  });

  return res.status(201).json(userResponse);
};

const listUsers = async (req: Request, res: Response): Promise<Response> => {
  const usersPagination = pagination(req.query);

  const paginationResponse = await paginationResponseSerializer.validate(
    usersPagination,
    { stripUnknown: true }
  );

  return res.status(200).json(paginationResponse);
};

const retrieveUser = async (req: Request, res: Response): Promise<Response> => {
  const userId = parseInt(req.params.id);
  const foundUser = users.find((user) => user.id === userId);

  const user = await userResponseSerializer.validate(foundUser, {
    stripUnknown: true,
  });

  return res.status(200).json(user);
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const userId = parseInt(req.params.id);
  const validatedBody = req.validatedBody as IUserUpdateRequest;

  const userIndex = users.findIndex((user) => user.id === userId);
  const userToUpdate = users[userIndex];

  users[userIndex] = { ...userToUpdate, ...validatedBody };

  const user = await userResponseSerializer.validate(users[userIndex], {
    stripUnknown: true,
  });

  return res.status(200).json(user);
};

const deleteUser = (req: Request, res: Response): Response => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);
  users.splice(userIndex, 1);

  return res.status(204).json();
};

export { createUser, listUsers, retrieveUser, updateUser, deleteUser };
