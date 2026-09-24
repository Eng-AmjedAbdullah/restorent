/**
 * Canonical Laravel API Response and Request Envelopes
 *
 * RestoraIntel authoritative backend contract definitions.
 * Follows Laravel standard JSON resource and error responses.
 */

export type ApiResponseStatus = 'success' | 'error';

/**
 * Standard Laravel API Success Response Envelope
 */
export interface ApiSuccessResponse<T> {
  status: 'success';
  message: string;
  data: T;
  meta: Record<string, unknown> | unknown[];
}

/**
 * Standard Laravel API Error Response Envelope
 */
export interface ApiErrorResponse {
  status: 'error';
  message: string;
  errors: Record<string, string[]> | null;
  meta: Record<string, unknown> | unknown[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Standard HTTP Status Codes used by Laravel REST API
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Structured Validation Error (HTTP 422)
 * In Laravel, `errors` is a key-value dictionary where keys are field names
 * and values are arrays of error message strings.
 */
export interface ApiValidationErrorResponse extends ApiErrorResponse {
  status: 'error';
  message: string;
  errors: Record<string, string[]>;
  meta: Record<string, unknown> | unknown[];
}

/**
 * Structured Authentication Error (HTTP 401)
 * Returned when Sanctum bearer token is missing, invalid, or expired.
 */
export interface ApiAuthenticationErrorResponse extends ApiErrorResponse {
  status: 'error';
  message: string;
  errors: null;
}

/**
 * Structured Authorization Error (HTTP 403)
 * Returned when user lacks permission code or attempts cross-tenant access.
 */
export interface ApiAuthorizationErrorResponse extends ApiErrorResponse {
  status: 'error';
  message: string;
  errors: null;
}

/**
 * Structured Resource Not Found Error (HTTP 404)
 * Returned when a queried model ID (restaurant, employee, etc.) does not exist.
 */
export interface ApiNotFoundErrorResponse extends ApiErrorResponse {
  status: 'error';
  message: string;
  errors: null;
}
