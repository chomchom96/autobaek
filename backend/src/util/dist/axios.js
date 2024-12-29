"use strict";
exports.__esModule = true;
exports.addLoggingInterceptors = void 0;
var axios_1 = require("axios");
var date = new Date().getTime();
// 로깅 인터셉터 추가
exports.addLoggingInterceptors = function (props) {
    props.axiosClient.interceptors.request.use(function (requestConfig) {
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
    }, function (error) {
        return Promise.reject(error);
    });
    props.axiosClient.interceptors.response.use(function (response) {
        var _a;
        var startTime = (_a = response.config.metadata) === null || _a === void 0 ? void 0 : _a.startTime;
        var duration = date - (startTime || 0); // 요청 소요 시간 계산
        // console.group(`✅ Axios Response [${response.status}]`);
        // console.log("URL:", response.config.url);
        // console.log("Duration:", `${duration}ms`);
        // console.log("Data Length:", JSON.stringify(response.data || {}).length);
        // console.groupEnd();
        return response; // 응답 반환
    }, function (error) {
        var _a, _b, _c, _d;
        var startTime = (_a = error.config.metadata) === null || _a === void 0 ? void 0 : _a.startTime;
        var duration = date - (startTime || 0); // 요청 소요 시간 계산
        console.error("❌ Axios Error Details:", {
            url: (_b = error === null || error === void 0 ? void 0 : error.config) === null || _b === void 0 ? void 0 : _b.url,
            method: (_c = error === null || error === void 0 ? void 0 : error.config) === null || _c === void 0 ? void 0 : _c.method,
            status: (_d = error.response) === null || _d === void 0 ? void 0 : _d.status,
            duration: duration + "ms",
            message: error.message
        });
        return Promise.reject(error); // 에러 반환
    });
};
// Axios 인스턴스 생성 및 인터셉터 추가 예시
var axiosClient = axios_1["default"].create({
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});
// 인터셉터 추가
exports.addLoggingInterceptors({ axiosClient: axiosClient });
exports["default"] = axiosClient;
