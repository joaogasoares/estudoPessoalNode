import type { WebhookEvent } from "../../domain/entities/webhook-event.js";
import { pool } from "../db/connection.js";

export const eventRepository = {
  async save(event: WebhookEvent): Promise<void> {
    const payload = (event as WebhookEvent & { payload?: unknown }).payload ?? event.data;

    await pool.query(
      `
      INSERT INTO webhook_events (event_id, event_type, payload, status)
      VALUES ($1, $2, $3::jsonb, $4)
      ON CONFLICT (event_id) DO NOTHING
      `,
      [event.event_id, event.event_type, JSON.stringify(payload), "received"]
    );
  },

  async findById(event_id: string): Promise<WebhookEvent | undefined> {
    const result = await pool.query<{
      event_id: string;
      event_type: string;
      payload: unknown;
      created_at: string;
    }>(
      `
      SELECT event_id, event_type, payload, created_at
      FROM webhook_events
      WHERE event_id = $1
      LIMIT 1
      `,
      [event_id]
    );

    const row = result.rows[0];
    if (!row) return undefined;

    return {
      event_id: row.event_id,
      event_type: row.event_type,
      timestamp: row.created_at,
      data: row.payload
    };
  },

  async findByEventId(eventId: string) {
    const result = await pool.query<{
      event_id: string;
      event_type: string;
      payload: unknown;
      created_at: string;
    }>(
      `SELECT event_id, event_type, payload, created_at
       FROM webhook_events
       WHERE event_id = $1
       LIMIT 1`,
      [eventId]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      event_id: row.event_id,
      event_type: row.event_type,
      timestamp: row.created_at,
      data: row.payload
    };
  }
};