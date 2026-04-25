import type { WebhookEvent } from "../../domain/entities/webhook-event.js";
import { eventRepository } from "../../infra/repositories/event-repository.js";
import { validateSignature } from "../../domain/services/signature-validator.js";

// Simula o processamento em background (mudança de estados)
async function processEventBackground(event: WebhookEvent) {
  try {
    await eventRepository.updateStatus(event.event_id, "processing");
    
    // Simula um pequeno delay de processamento real
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // Simula que o processamento deu certo
    await eventRepository.updateStatus(event.event_id, "processed");
  } catch (err) {
    // Em caso de falha no processamento
    await eventRepository.updateStatus(event.event_id, "failed");
    console.error(`Erro ao processar evento ${event.event_id}:`, err);
  }
}

export async function receiveEvent(event: WebhookEvent, signature: string): Promise<{ success: boolean; error?: string }> {
  // 1. Valida assinatura
  if (!validateSignature(event, signature)) {
    return { success: false, error: "Invalid signature" };
  }

  // 2. Salva evento no banco (status: received)
  try {
    await eventRepository.save(event);
    
    // 3. Inicia processamento de forma assíncrona (não bloqueia a API)
    processEventBackground(event).catch(console.error);

    return { success: true };
  } catch (err) {
    return { success: false, error: "Database error" };
  }
}