import type { Request, Response } from "express";

export const webhookController = {
  handle: (req: Request, res: Response) => {
    // Minimal validation example
    const { event_id, event_type, timestamp, data } = req.body;
    if (!event_id || !event_type || !timestamp || !data) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    // For now, just echo back
    return res.status(200).json({ received: true });
  }
};

export default webhookController;