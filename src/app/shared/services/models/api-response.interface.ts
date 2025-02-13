export interface ApiResponse<T> {
  data: T;
  meta: any;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errorName: String;
  details: unknown;
}
