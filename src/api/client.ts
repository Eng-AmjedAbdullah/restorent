/**
 * RestoraIntel API Client Foundation
 * Prepared for future Laravel Sanctum / REST API integration.
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export class ApiClient {
  private static token: string | null = null;

  static setAuthToken(token: string | null) {
    this.token = token;
  }

  static getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }
}
