import request from "supertest";
import app from "../src/app.js";

describe("POST /webhooks/provider-a", () => {
  it("should return 200 for valid payload and signature", async () => {
    const response = await request(app)
      .post("/webhooks/provider-a")
      .set("x-signature", "valid-signature")
      .send({
        event_id: "evt_test_001",
        event_type: "payment.succeeded",
        timestamp: "2026-04-22T12:00:00.000Z",
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
        timestamp: "2026-04-22T12:00:00.000Z",
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
        timestamp: "2026-04-22T12:00:00.000Z",
        data: { amount: 100 }
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid signature" });
  });
});