import type { Request, Response } from "express";
import type { WebhookEvent } from "../../domain/entities/webhook-event.js";
import { receiveEvent } from "../../application/use-cases/receive-event.js";

export const webhookController = {
  handle: async (req: Request, res: Response) => {
    const event_id = req.body?.event_id ?? req.body?.eventId;
    const event_type = req.body?.event_type ?? req.body?.eventType;
    const data = req.body?.data ?? req.body?.payload;
    const timestamp = req.body?.timestamp ?? new Date().toISOString();

    if (!event_id || !event_type || !data) {
      return res.status(400).json({ error: "Invalid payload" });
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

    const result = await receiveEvent(event, signature);

    if (!result.success) {
      if (result.error === "Invalid signature") {
        return res.status(401).json({ error: result.error });
      }
      return res.status(500).json({ error: result.error ?? "Internal error" });
    }

    return res.status(200).json({ received: true });
  }
};

export default webhookController;