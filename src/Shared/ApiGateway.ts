import {API_HOST} from "./config";

export default class ApiGateway {
  get = async (path: string): Promise<any> => {
    const response = await fetch(`${API_HOST}${path}`);
    return response.json(); // DTO
  };
  post = async (path: string, payload: object): Promise<any> => {
    const response = await fetch(`${API_HOST}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(payload)
    });
    return response.json(); // DTO
  };
}
