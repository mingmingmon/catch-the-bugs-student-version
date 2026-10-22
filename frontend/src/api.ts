import type { Api } from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export function createApi(token: string): Api {
  return async <T>(
    path: string,
    options: Parameters<Api>[1] = {},
  ): Promise<T> => {
    const method = options.method || "GET";
    let status = 0;
    let response: unknown;
    const timeout = new AbortController();
    const timer = window.setTimeout(() => timeout.abort(), 15000);
    const signal = options.signal
      ? AbortSignal.any([options.signal, timeout.signal])
      : timeout.signal;
    try {
      const result = await fetch(`/api${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options.body !== undefined
            ? { "Content-Type": "application/json" }
            : {}),
          ...options.headers,
        },
        ...(options.body !== undefined
          ? { body: JSON.stringify(options.body) }
          : {}),
        signal,
      });
      status = result.status;
      const raw = await result.text();
      try {
        response = raw ? JSON.parse(raw) : null;
      } catch {
        response = { error: raw || "서버 응답을 읽을 수 없습니다." };
      }
      if (!result.ok) {
        const message =
          typeof response === "object" &&
          response !== null &&
          "error" in response
            ? String(response.error)
            : "요청을 처리하지 못했습니다.";
        throw new ApiError(status, message);
      }
      return response as T;
    } catch (error) {
      if (options.signal?.aborted) throw error;
      if (error instanceof ApiError) throw error;
      const message = timeout.signal.aborted
        ? "서버 응답 시간이 초과됐습니다. 잠시 후 다시 시도해 주세요."
        : "서버에 연결할 수 없습니다. 백엔드 실행 상태를 확인해 주세요.";
      response = { error: message };
      throw new ApiError(0, message);
    } finally {
      window.clearTimeout(timer);
    }
  };
}
export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "요청을 처리하지 못했습니다.";
}
export const won = (value: number) =>
  new Intl.NumberFormat("ko-KR").format(value);
export function dateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(value));
}
export function timeLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
}
