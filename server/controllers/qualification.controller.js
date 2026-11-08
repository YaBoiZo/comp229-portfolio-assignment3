import { createCrudController } from "./crud.controller.js";
import { Qualification } from "../models/qualification.model.js";

export const qualificationController = createCrudController(
  Qualification,
  "Qualification",
  [
    "title",
    "firstname",
    "lastname",
    "email",
    "completion",
    "description",
    "image",
    "type",
    "roleDescription",
    "outcome",
    "tools",
    "institution",
    "start",
    "status",
  ],
);
