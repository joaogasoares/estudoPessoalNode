import pino from "pino";
export const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: {
        target: "pino-pretty",
        options: { colorize: true }
    }
});
// Exemplo de uso:
// logger.info("Mensagem de log");
//# sourceMappingURL=logger.js.map