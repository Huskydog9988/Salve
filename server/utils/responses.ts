import { ServerResponse } from "http";

/**
 * Sends a 200 ok response with data
 * @param res server response
 * @param data data to respond with
 */
export function resResult(res: ServerResponse, data: any) {
  res.writeHead(200, { "Content-Type": "text/json" });
  res.write(JSON.stringify(data));
  res.end();
}

export function resError(
  res: ServerResponse,
  error: string,
  code: number = 500
) {
  res.writeHead(code, { "Content-Type": "text/json" });
  res.write(JSON.stringify({ error }));
  res.end();
}
