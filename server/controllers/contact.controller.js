import { createCrudController } from "./crud.controller.js";
import { Contact } from "../models/contact.model.js";

export const contactController = createCrudController(Contact, "Contact", [
  "firstname",
  "lastname",
  "email",
  "phone",
  "message",
]);
