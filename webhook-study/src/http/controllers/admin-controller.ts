import type { Request, Response } from "express";
import { replayEvent } from "../../application/use-cases/replay-event.js";

export const adminController = {
  async replay(req: Request, res: Response): Promise<void> {
    const eventId = req.params.eventId as string;

    if (!eventId) {
      res.status(400).json({ error: "Event ID is required" });
      return;
    }

    const result = await replayEvent(eventId);

    if (!result.success) {
      if (result.error === "Event not found") {
        res.status(404).json({ error: result.error });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.status(202).json({ message: "Event queued for replay" });
  }
};
