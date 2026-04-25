import { eventRepository } from "../../infra/repositories/event-repository.js";
import { processEventBackground } from "./receive-event.js";

export async function replayEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  // 1. Busca o evento no banco de dados
  const event = await eventRepository.findById(eventId);

  if (!event) {
    return { success: false, error: "Event not found" };
  }

  // Num sistema real, talvez devêssemos verificar se o status atual é "failed"
  // antes de permitir o replay, mas vamos permitir reenviar qualquer evento para teste.

  // 2. Coloca o status de volta para received/processing (feito dentro do processEventBackground)
  // 3. Inicia o processamento em background novamente
  processEventBackground(event).catch(console.error);

  return { success: true };
}
