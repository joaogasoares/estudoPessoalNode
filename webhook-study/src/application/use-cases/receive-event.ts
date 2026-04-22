import type { WebhookEvent } from "../../domain/entities/webhook-event.js";
import { eventRepository } from "../../infra/repositories/event-repository.js";
import { validateSignature } from "../../domain/services/signature-validator.js";

export async function receiveEvent(event: WebhookEvent, signature: string): Promise<{ success: boolean; error?: string }> {
  // 1. Valida assinatura
  if (!validateSignature(event, signature)) {
    return { success: false, error: "Invalid signature" };
  }

  // 2. Salva evento no banco (status: received)
  try {
    await eventRepository.save(event);
    return { success: true };
  } catch (err) {
    return { success: false, error: "Database error" };
  }
}