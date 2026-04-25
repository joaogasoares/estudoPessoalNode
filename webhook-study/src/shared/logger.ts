import pino from "pino";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

export const requestContext = new AsyncLocalStorage<{ requestId: string }>();

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  mixin() {
    const store = requestContext.getStore();
    return store ? { request_id: store.requestId } : {};
  },
  transport: {
    target: "pino-pretty",
    options: { colorize: true }
  }
});

// Middleware para injetar o request_id no contexto assíncrono
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  res.setHeader('X-Request-Id', requestId);
  
  requestContext.run({ requestId }, () => {
    next();
  });
}