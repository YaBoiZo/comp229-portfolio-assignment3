import { createCrudController } from "./crud.controller.js";
import { User } from "../models/user.model.js";

export const userController = createCrudController(User, "User", [
  "name",
  "email",
  "password",
]);
