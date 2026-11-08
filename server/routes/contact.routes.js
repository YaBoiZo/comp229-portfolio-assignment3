import { Router } from "express";
import { contactController } from "../controllers/contact.controller.js";
import {
  requireAuthentication,
  requireAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(requireAuthentication, requireAdmin, contactController.list)
  .post(contactController.create)
  .delete(requireAuthentication, requireAdmin, contactController.removeAll);
router
  .route("/:id")
  .get(requireAuthentication, requireAdmin, contactController.read)
  .put(requireAuthentication, requireAdmin, contactController.update)
  .delete(requireAuthentication, requireAdmin, contactController.remove);

export default router;
