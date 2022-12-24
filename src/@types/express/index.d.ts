import { IUserRequest } from "../../interfaces";

declare global {
  namespace Express {
    interface Request {
      validatedBody: IUserRequest;
    }
  }
}
