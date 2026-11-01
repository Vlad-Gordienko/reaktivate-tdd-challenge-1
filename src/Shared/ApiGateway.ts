import {API_HOST} from "./config";
import {HttpError} from "./HttpError";
import {HttpGateway} from "./HttpGateway";
import {NetworkError} from "./NetworkError";

async function toResponse(request: Promise<Response>): Promise<Response> {
  try {
    return await request;
  } catch (error) {
    throw new NetworkError(error instanceof Error ? error.message : undefined);
  }
}

export default class ApiGateway implements HttpGateway {
  get = async (path: string): Promise<any> => {
    const response = await toResponse(fetch(`${API_HOST}${path}`));
    if (!response.ok) {
      throw new HttpError(response.status);
    }
    return response.json(); // DTO
  };
  post = async (path: string, payload: object): Promise<any> => {
    const response = await toResponse(
      fetch(`${API_HOST}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(payload)
      })
    );
    if (!response.ok) {
      throw new HttpError(response.status);
    }
    return response.json(); // DTO
  };
}
