import axios from "axios";
const date = new Date().getTime();
// 로깅 인터셉터 추가
export const addLoggingInterceptors = (props) => {
    props.axiosClient.interceptors.request.use((requestConfig) => {
        requestConfig.metadata = requestConfig.metadata || {};
        requestConfig.metadata.startTime = date;
        // console.group(
        //   `🚀 Axios Request [${requestConfig.method?.toUpperCase()}]`
        // );
        // console.log("URL:", requestConfig.url);
        // console.log("Method:", requestConfig.method);
        // console.log("Params:", JSON.stringify(requestConfig.params || {}));
        // console.log("Headers:", Object.keys(requestConfig.headers || {}));
        // console.groupEnd();
        return requestConfig; // 요청 구성 반환
    }, (error) => {
        return Promise.reject(error);
    });
    props.axiosClient.interceptors.response.use((response) => {
        const startTime = response.config.metadata?.startTime;
        const duration = date - (startTime || 0); // 요청 소요 시간 계산
        // console.group(`✅ Axios Response [${response.status}]`);
        // console.log("URL:", response.config.url);
        // console.log("Duration:", `${duration}ms`);
        // console.log("Data Length:", JSON.stringify(response.data || {}).length);
        // console.groupEnd();
        return response; // 응답 반환
    }, (error) => {
        const startTime = error.config.metadata?.startTime;
        const duration = date - (startTime || 0); // 요청 소요 시간 계산
        console.error("❌ Axios Error Details:", {
            url: error?.config?.url,
            method: error?.config?.method,
            status: error.response?.status,
            duration: `${duration}ms`,
            message: error.message,
        });
        return Promise.reject(error); // 에러 반환
    });
};
// Axios 인스턴스 생성 및 인터셉터 추가 예시
const axiosClient = axios.create({
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
// 인터셉터 추가
addLoggingInterceptors({ axiosClient });
export default axiosClient;
