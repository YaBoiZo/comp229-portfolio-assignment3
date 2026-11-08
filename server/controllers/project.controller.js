import { createCrudController } from "./crud.controller.js";
import { Project } from "../models/project.model.js";

export const projectController = createCrudController(Project, "Project", [
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
]);
