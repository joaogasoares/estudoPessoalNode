import { Router } from "express";
import { webhookController } from "./controllers/webhook-controller.js";

import { adminController } from "./controllers/admin-controller.js";

const router = Router();

router.post("/webhooks/provider-a", webhookController.handle);
router.post("/admin/events/:eventId/replay", adminController.replay);

export default router;