export class UnauthorizedError extends Error {
  extensions: { code: string; http: { status: number } };
  constructor(message = "Unauthorized") {
    super(message);
    this.extensions = {
      code: "UNAUTHORIZED",
      http: { status: 401 },
    };
  }
}