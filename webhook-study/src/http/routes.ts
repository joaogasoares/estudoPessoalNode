import { Router } from "express";
import { webhookController } from "./controllers/webhook-controller.js";

const router = Router();

router.post("/webhooks/provider-a", webhookController.handle);

export default router;