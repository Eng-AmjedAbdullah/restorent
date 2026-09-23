import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';

/**
 * RestoraIntel API Client
 * Enterprise HTTP client configured for future Laravel Sanctum / REST API integration.
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

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiClientService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor: Attach Sanctum Bearer Token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.token || (typeof localStorage !== 'undefined' ? localStorage.getItem('restoraintel_token') : null);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor: Standardized Error & Response Handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: any) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An unexpected error occurred',
          status: error.response?.status,
          errors: error.response?.data?.errors
        };

        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Unauthorized / Session Expired
              this.clearAuthToken();
              // Placeholder for auth redirect if not already on login
              if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                // window.location.href = '/login';
              }
              break;
            case 403:
              // Forbidden / Insufficient Permissions
              console.warn('[API 403 Forbidden]:', apiError.message);
              break;
            case 422:
              // Laravel Validation Errors
              console.warn('[API 422 Validation Error]:', apiError.errors);
              break;
            case 500:
              // Internal Server Error
              console.error('[API 500 Server Error]:', apiError.message);
              break;
            default:
              break;
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Token management placeholders
  public setAuthToken(token: string | null): void {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      if (token) {
        localStorage.setItem('restoraintel_token', token);
      } else {
        localStorage.removeItem('restoraintel_token');
      }
    }
  }

  public getAuthToken(): string | null {
    return this.token || (typeof localStorage !== 'undefined' ? localStorage.getItem('restoraintel_token') : null);
  }

  public clearAuthToken(): void {
    this.token = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('restoraintel_token');
    }
  }

  // Generic request methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  public getRawAxios(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClientService();
export default apiClient;
