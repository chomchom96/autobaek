const axios = require('axios');

function createAdvancedAxiosMiddleware() {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  instance.interceptors.request.use(
    (config) => {
      config.metadata = { 
        startTime: new Date(),
        retryCount: 0,
        maxRetries: config.maxRetries || 3
      };

      console.group(`🚀 Axios Request [${config.method.toUpperCase()}]`);
      console.log('URL:', config.url);
      console.log('Method:', config.method);
      console.log('Params:', JSON.stringify(config.params || {}));
      console.log('Headers:', Object.keys(config.headers || {}));
      console.groupEnd();

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => {
      
    //   console.group(`✅ Axios Response [${response.status}]`);
    //   console.log('URL:', response.config.url);
    //   console.log('Duration:', `${duration}ms`);
    //   console.log('Data Length:', JSON.stringify(response.data || {}).length);
    //   console.groupEnd();

      return response;
    },
    async (error) => {
      const config = error.config;

      if (config && config.metadata.retryCount < config.metadata.maxRetries) {
        config.metadata.retryCount += 1;

        const retryReasons = [
          error.code === 'ECONNABORTED',
          error.response && error.response.status >= 500
        ];

        if (retryReasons.some(Boolean)) {
          console.warn(`🔄 Retry Attempt ${config.metadata.retryCount} for ${config.url}`);
          return instance(config);
        }
      }

    //   console.error('❌ Axios Error Details:', {
    //     url: config?.url,
    //     method: config?.method,
    //     status: error.response?.status,
    //     data: error.response?.data,
    //     message: error.message
    //   });

      return Promise.reject(error);
    }
  );

  return instance;
}

module.exports = createAdvancedAxiosMiddleware();