import {
  BostaCreateFullfillmentPayload,
  BostaCreateFullfillmentResponse,
} from "./client.types";

export default class BostaClient {
  protected baseURL = "http://app.bosta.co/api/v2/";

  constructor(private apiKey: string) {}
  async request<T = object>(url: string, requestInit?: RequestInit) {
    return fetch(`${this.baseURL}${url}`, {
      ...requestInit,
      headers: {
        Authorization: this.apiKey,
      },
    }) as T;
  }
  createFullfillment(payload: BostaCreateFullfillmentPayload) {
    return this.request<BostaCreateFullfillmentResponse>(
      "http://app.bosta.co/api/v2/deliveries",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }
}
