export interface HttpGateway {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, payload: object): Promise<T>;
}
