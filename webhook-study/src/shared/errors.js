export class AppError extends Error {
    message;
    statusCode;
    constructor(message, statusCode = 400) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
// Exemplo de uso:
// throw new AppError("Invalid payload", 400);
//# sourceMappingURL=errors.js.map