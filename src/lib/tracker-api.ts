import axios, { AxiosInstance } from 'axios';
import BASE_URL from '@/lib/utils/baseUrl';

interface TrackerResponse {
  statusCode: number;
  data: {
    tracker: any;
    status_config: Record<string, any>;
    timeline: any[];
  };
  message: string;
  success: boolean;
}

interface AllTrackersResponse {
  statusCode: number;
  data: {
    status_config: Record<string, any>;
    trackers: any[];
  };
  message: string;
  success: boolean;
}

interface UpdateTrackerPayload {
  status?: string;
  notes?: string;
  [key: string]: any;
}

class TrackerApi {
  private api: AxiosInstance;

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  /**
   * Fetch tracker details for a specific press release
   */
  async getTracker(prId: string, token?: string | null): Promise<TrackerResponse> {
    try {
      console.log('[TrackerApi.getTracker] Starting request', {
        prId,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'null',
        baseURL: this.api.defaults.baseURL,
      });

      // Use this.api instance instead of global axios
      // Include token in headers if provided
      const response = await this.api.get(
        `/api/v1/press-releases/progress/${prId}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      console.log('[TrackerApi.getTracker] Request successful', {
        statusCode: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
      });

      return response.data;
    } catch (error) {
      console.error('[TrackerApi.getTracker] Request failed', {
        prId,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      if (axios.isAxiosError(error)) {
        console.error('[TrackerApi.getTracker] Axios error details', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          responseData: error.response?.data,
        });
      }

      throw error;
    }
  }

  /**
   * Fetch all trackers
   */
  async getAllTrackers(token?: string | null): Promise<AllTrackersResponse> {
    try {
      console.log('[TrackerApi.getAllTrackers] Starting request', {
        hasToken: !!token,
        baseURL: this.api.defaults.baseURL,
      });

      const response = await this.api.get(
        `/api/v1/press-releases/tracker/all`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      console.log('[TrackerApi.getAllTrackers] Request successful', {
        statusCode: response.status,
        trackersCount: response.data?.data?.trackers?.length || 0,
      });

      return response.data;
    } catch (error) {
      console.error('[TrackerApi.getAllTrackers] Request failed', {
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      if (axios.isAxiosError(error)) {
        console.error('[TrackerApi.getAllTrackers] Axios error', {
          status: error.response?.status,
          url: error.config?.url,
        });
      }

      throw error;
    }
  }

  /**
   * Update tracker status
   */
  async updateTrackerStatus(
    prId: string,
    payload: UpdateTrackerPayload,
    token?: string | null
  ): Promise<any> {
    try {
      console.log('[TrackerApi.updateTrackerStatus] Starting request', {
        prId,
        payloadKeys: Object.keys(payload),
        hasToken: !!token,
      });

      const response = await this.api.put(
        `/api/v1/press-releases/tracker/${prId}/status`,
        payload,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      console.log('[TrackerApi.updateTrackerStatus] Request successful', {
        statusCode: response.status,
      });

      return response.data;
    } catch (error) {
      console.error('[TrackerApi.updateTrackerStatus] Request failed', {
        prId,
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      if (axios.isAxiosError(error)) {
        console.error('[TrackerApi.updateTrackerStatus] Axios error', {
          status: error.response?.status,
          url: error.config?.url,
          responseData: error.response?.data,
        });
      }

      throw error;
    }
  }
}

export default TrackerApi;
