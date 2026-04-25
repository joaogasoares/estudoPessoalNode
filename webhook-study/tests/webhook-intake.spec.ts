import request from "supertest";
import app from "../src/app.js";
import { pool } from "../src/infra/db/connection.js";

afterAll(async () => {
  await pool.end();
});


describe("POST /webhooks/provider-a", () => {
  it("should return 200 for valid payload and signature", async () => {
    const response = await request(app)
      .post("/webhooks/provider-a")
      .set("x-signature", "valid-signature")
      .send({
        event_id: "evt_test_001",
        event_type: "payment.succeeded",
        timestamp: new Date().toISOString(),
        data: { amount: 100 }
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: true });
  });

  it("should return 400 for invalid payload", async () => {
    const response = await request(app)
      .post("/webhooks/provider-a")
      .set("x-signature", "valid-signature")
      .send({
        event_id: "evt_test_002",
        // event_type faltando
        timestamp: new Date().toISOString(),
        data: { amount: 100 }
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid payload" });
  });

  it("should return 401 for invalid signature", async () => {
    const response = await request(app)
      .post("/webhooks/provider-a")
      .set("x-signature", "wrong-signature")
      .send({
        event_id: "evt_test_003",
        event_type: "payment.succeeded",
        timestamp: new Date().toISOString(),
        data: { amount: 100 }
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid signature" });
  });

  it("should handle idempotency correctly (same event_id twice)", async () => {
    const eventPayload = {
      event_id: "evt_test_idempotency_001",
      event_type: "payment.succeeded",
      timestamp: new Date().toISOString(),
      data: { amount: 200 }
    };

    // First request
    const response1 = await request(app)
      .post("/webhooks/provider-a")
      .set("x-signature", "valid-signature")
      .send(eventPayload);

    expect(response1.status).toBe(200);

    // Second request with the same payload
    const response2 = await request(app)
      .post("/webhooks/provider-a")
      .set("x-signature", "valid-signature")
      .send(eventPayload);

    expect(response2.status).toBe(200);

    // Verify database only has 1 record
    const result = await pool.query(
      "SELECT count(*) FROM webhook_events WHERE event_id = $1",
      [eventPayload.event_id]
    );

    expect(parseInt(result.rows[0].count, 10)).toBe(1);
  });
});