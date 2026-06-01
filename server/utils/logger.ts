export const logger = {
  info: (context: string, message: string, data?: any) => {
    console.log(`[${new Date().toISOString()}] [INFO] [${context}] ${message}`, data ? JSON.stringify(data) : '');
  },
  warn: (context: string, message: string, data?: any) => {
    console.warn(`[${new Date().toISOString()}] [WARN] [${context}] ${message}`, data ? JSON.stringify(data) : '');
  },
  error: (context: string, message: string, error?: any) => {
    console.error(`[${new Date().toISOString()}] [ERROR] [${context}] ${message}`, error?.message || error || '');
  },
  debug: (context: string, message: string, data?: any) => {
    if (process.env.DEBUG === 'true') {
      console.log(`[${new Date().toISOString()}] [DEBUG] [${context}] ${message}`, data ? JSON.stringify(data) : '');
    }
  }
};
