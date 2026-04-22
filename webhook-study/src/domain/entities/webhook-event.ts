export interface WebhookEvent {
  event_id: string;
  event_type: string;
  timestamp: string; // pode ser string (ISO) ou Date, dependendo do seu fluxo
  data: unknown;     // flexível para diferentes tipos de payload
  signature?: string; // opcional, caso queira armazenar a assinatura
}