import type { WebhookEvent } from "../../domain/entities/webhook-event.js";
export declare function receiveEvent(event: WebhookEvent, signature: string): Promise<{
    success: boolean;
    error?: string;
}>;
//# sourceMappingURL=receive-event.d.ts.map