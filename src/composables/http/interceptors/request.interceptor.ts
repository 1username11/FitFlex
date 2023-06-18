import type { AxiosError, AxiosRequestConfig } from 'axios'

const requestInterceptor = (requestConfig: AxiosRequestConfig): AxiosRequestConfig => {
  return requestConfig
}

const requestErrorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

export {
  requestInterceptor,
  requestErrorInterceptor
}
