import type { WebhookEvent } from "../../domain/entities/webhook-event.js";

// Simulação de "banco de dados" em memória
const events: WebhookEvent[] = [];

export const eventRepository = {
  async save(event: WebhookEvent): Promise<void> {
    events.push(event);
    // Aqui você pode adicionar lógica para evitar duplicidade, etc.
  },

  async findById(event_id: string): Promise<WebhookEvent | undefined> {
    return events.find(e => e.event_id === event_id);
  },

  // Outros métodos podem ser adicionados conforme necessário
};