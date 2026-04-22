export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
    this.name = "AppError";
  }
}

// Exemplo de uso:
// throw new AppError("Invalid payload", 400);