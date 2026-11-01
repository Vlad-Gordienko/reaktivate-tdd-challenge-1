export class NetworkError extends Error {
  constructor(message?: string) {
    super(message ?? "Network error");
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
