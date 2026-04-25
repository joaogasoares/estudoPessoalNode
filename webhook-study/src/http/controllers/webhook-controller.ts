import type { Request, Response } from "express";
import type { WebhookEvent } from "../../domain/entities/webhook-event.js";
import { receiveEvent } from "../../application/use-cases/receive-event.js";
import { logger } from "../../shared/logger.js";

export const webhookController = {
  handle: async (req: Request, res: Response): Promise<void> => {
    const event_id = req.body?.event_id ?? req.body?.eventId;
    const event_type = req.body?.event_type ?? req.body?.eventType;
    const data = req.body?.data ?? req.body?.payload;
    const timestamp = req.body?.timestamp ?? new Date().toISOString();

    if (!event_id || !event_type || !data) {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    const signatureHeader = req.headers["x-signature"];
    const signature = typeof signatureHeader === "string" ? signatureHeader : "";

    const event = {
      event_id,
      event_type,
      timestamp,
      data,
      payload: data
    } as unknown as WebhookEvent;

    logger.info({ event_id }, "Recebendo novo webhook");

    const result = await receiveEvent(event, signature);

    if (!result.success) {
      logger.error({ error: result.error }, "Falha ao processar webhook");
      if (result.error === "Invalid signature") {
        res.status(401).json({ error: result.error });
        return;
      }
      res.status(500).json({ error: result.error ?? "Internal error" });
      return;
    }

    res.status(200).json({ received: true });
  }
};