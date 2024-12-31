import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Axios 구성에 메타데이터 추가
interface AxiosRequestConfigWithMetadata<T = unknown>
  extends InternalAxiosRequestConfig<T> {
  metadata?: {
    startTime?: number;
    endTime?: number;
  };
}

interface AxiosResponseWithMetadata<T = unknown, D = unknown>
  extends AxiosResponse<T, D> {
  config: AxiosRequestConfigWithMetadata<D>;
}

interface AxiosErrorWithMetadata<T = unknown, D = unknown>
  extends AxiosError<T, D> {
  config: AxiosRequestConfigWithMetadata<D>;
}

export interface AxiosInterceptorProps {
  axiosClient: AxiosInstance;
}

const date = new Date().getTime();

// 로깅 인터셉터 추가
export const addLoggingInterceptors = (props: AxiosInterceptorProps) => {
  props.axiosClient.interceptors.request.use(
    (requestConfig: AxiosRequestConfigWithMetadata) => {
      requestConfig.metadata = requestConfig.metadata || {};
      requestConfig.metadata.startTime = date;
      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  props.axiosClient.interceptors.response.use(
    (response: AxiosResponseWithMetadata) => {
      return response;
    },
    (error: AxiosErrorWithMetadata) => {
      const startTime = error.config.metadata?.startTime;
      const duration = date - (startTime || 0);

      console.error("❌ Axios Error Details:", {
        url: error?.config?.url,
        method: error?.config?.method,
        status: error.response?.status,
        duration: `${duration}ms`,
        message: error.message,
      });
      return Promise.reject(error);
    }
  );
};

// Axios 인스턴스 생성 시 baseURL 설정
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인터셉터 추가
addLoggingInterceptors({ axiosClient });

export default axiosClient;
