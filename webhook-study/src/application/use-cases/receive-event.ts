import type { WebhookEvent } from "../../domain/entities/webhook-event.js";
import { eventRepository } from "../../infra/repositories/event-repository.js";
import { validateSignature } from "../../domain/services/signature-validator.js";

// Simula o processamento em background (mudança de estados) com Retry e Backoff
export async function processEventBackground(event: WebhookEvent) {
  const maxRetries = 3;
  let attempt = 0;

  await eventRepository.updateStatus(event.event_id, "processing");

  while (attempt < maxRetries) {
    try {
      attempt++;
      
      // Simula um pequeno delay de processamento real
      await new Promise((resolve) => setTimeout(resolve, 50));
      
      // AQUI ENTRARIA A LOGICA REAL:
      // Exemplo: await enviarParaOutraApi(event.data);
      // Se isso falhar (ex: API fora do ar), vai pro bloco catch.
      
      // Simula que o processamento deu certo
      await eventRepository.updateStatus(event.event_id, "processed");
      return; // Sucesso, sai da função e encerra o fluxo
      
    } catch (err) {
      if (attempt >= maxRetries) {
        // Esgotou as tentativas
        await eventRepository.updateStatus(event.event_id, "failed");
        console.error(`Erro fatal: Evento ${event.event_id} falhou após ${maxRetries} tentativas.`, err);
        return;
      }
      
      // Backoff Simples: Espera um tempo progressivo antes de tentar de novo.
      // 1ª falha = espera 100ms. 2ª falha = espera 200ms... (Em produção seriam segundos/minutos)
      const backoffTimeMs = attempt * 100;
      console.warn(`[Retry] Tentativa ${attempt} falhou para ${event.event_id}. Tentando de novo em ${backoffTimeMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffTimeMs));
    }
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