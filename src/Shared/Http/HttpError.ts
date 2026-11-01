export class HttpError extends Error {
  status: number;

  constructor(status: number) {
    super(`HTTP ${status}`);
    this.name = "HttpError";
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
