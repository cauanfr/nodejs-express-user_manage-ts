import { Request, Response, NextFunction } from "express";
import { AnySchema, ValidationError } from "yup";
import users from "./database";

const validateBodyMiddleware =
  (serializer: AnySchema) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const validatedBody = await serializer.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.validatedBody = validatedBody;

      return next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.errors });
      }
    }
  };

const verifyEmailAlreadyExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const emailExists = users.some(
    (user) => user.email === req.validatedBody.email
  );

  if (emailExists)
    return res.status(409).json({ message: "Email already exists." });

  return next();
};

const verifyCpfAlreadyExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const cpfExists = users.some((user) => user.cpf === req.validatedBody.cpf);

  if (cpfExists)
    return res.status(409).json({ message: "CPF already exists." });

  return next();
};

const verifyUserExistsByIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const userExists = users.some((user) => user.id === parseInt(req.params.id));
  if (!userExists) return res.status(404).json({ message: "User not found." });

  return next();
};

export {
  validateBodyMiddleware,
  verifyEmailAlreadyExistsMiddleware,
  verifyCpfAlreadyExistsMiddleware,
  verifyUserExistsByIdMiddleware,
};
