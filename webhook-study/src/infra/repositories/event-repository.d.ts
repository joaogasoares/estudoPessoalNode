import type { WebhookEvent } from "../../domain/entities/webhook-event.js";
export declare const eventRepository: {
    save(event: WebhookEvent): Promise<void>;
    findById(event_id: string): Promise<WebhookEvent | undefined>;
    findByEventId(eventId: string): Promise<{
        event_id: string;
        event_type: string;
        timestamp: string;
        data: unknown;
    } | null>;
};
//# sourceMappingURL=event-repository.d.ts.map