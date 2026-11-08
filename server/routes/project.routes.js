import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";
import {
  requireAuthentication,
  requireAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(projectController.list)
  .post(requireAuthentication, requireAdmin, projectController.create)
  .delete(requireAuthentication, requireAdmin, projectController.removeAll);
router
  .route("/:id")
  .get(projectController.read)
  .put(requireAuthentication, requireAdmin, projectController.update)
  .delete(requireAuthentication, requireAdmin, projectController.remove);

export default router;
