import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import {
  requireAuthentication,
  requireAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(requireAuthentication, requireAdmin, userController.list)
  .post(userController.create)
  .delete(requireAuthentication, requireAdmin, userController.removeAll);
router
  .route("/:id")
  .get(requireAuthentication, requireAdmin, userController.read)
  .put(requireAuthentication, requireAdmin, userController.update)
  .delete(requireAuthentication, requireAdmin, userController.remove);

export default router;
