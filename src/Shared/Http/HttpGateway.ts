export interface HttpGateway {
  get(path: string): Promise<any>;
  post(path: string, payload: object): Promise<any>;
}
