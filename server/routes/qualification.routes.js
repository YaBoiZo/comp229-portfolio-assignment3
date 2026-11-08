import { Router } from "express";
import { qualificationController } from "../controllers/qualification.controller.js";
import {
  requireAuthentication,
  requireAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(qualificationController.list)
  .post(requireAuthentication, requireAdmin, qualificationController.create)
  .delete(
    requireAuthentication,
    requireAdmin,
    qualificationController.removeAll,
  );
router
  .route("/:id")
  .get(qualificationController.read)
  .put(requireAuthentication, requireAdmin, qualificationController.update)
  .delete(requireAuthentication, requireAdmin, qualificationController.remove);

export default router;
