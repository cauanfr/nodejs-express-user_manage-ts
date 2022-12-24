import express from "express";
import {
  createUser,
  deleteUser,
  listUsers,
  retrieveUser,
  updateUser,
} from "./users";
import { userCreateRequestSerializer, userUpdateRequestSerializer } from "./serializers";
import {
  validateBodyMiddleware,
  verifyCpfAlreadyExistsMiddleware,
  verifyEmailAlreadyExistsMiddleware,
  verifyUserExistsByIdMiddleware,
} from "./middlewares";

const app = express();

app.use(express.json());

app.post(
  "/users",
  validateBodyMiddleware(userCreateRequestSerializer),
  verifyCpfAlreadyExistsMiddleware,
  verifyEmailAlreadyExistsMiddleware,
  createUser
);
app.get("/users", listUsers);
app.get("/users/:id", verifyUserExistsByIdMiddleware, retrieveUser);
app.patch(
  "/users/:id",
  verifyUserExistsByIdMiddleware,
  validateBodyMiddleware(userUpdateRequestSerializer),
  verifyCpfAlreadyExistsMiddleware,
  verifyEmailAlreadyExistsMiddleware,
  updateUser
);
app.delete("/users/:id", verifyUserExistsByIdMiddleware, deleteUser);

export default app;
