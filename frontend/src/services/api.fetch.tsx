//import { enqueueSnackbar, OptionsObject } from 'notistack';
//import Auth from './auth';
import { useCallback, useState } from 'react';
import {Config} from "@/config";
//import Auth from "./auth"
//import { useCallback } from 'react';

//const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1'
//const apiURL = import.meta.env.SERVER_API_URL || 'https://dragon-farm.online/api/v1'
export const apiURL = Config.url


export async function apiFetch<T>(
    url: string,
    method: string,
    body: Record<string, unknown> | null = null,
    //enqueueSnackbar: (msg: string, options?: OptionsObject) => void
  ): Promise<T | undefined> {

    const options: RequestInit = {
      method,
      headers: {
        // 'Content-Type': 'application/json',
        // ...(Auth.accessToken ? { 'Authorization': `Bearer ${Auth.accessToken}` } : {})
      },
      body: body ? JSON.stringify(body) : null,
      //keepalive: false // Убедитесь, что вам это действительно нужно
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Таймаут 10 секунд

      const response = await fetch(`${apiURL}${url}`, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const res = await response.json()

        if (res && res.msg) {
          return res
        } else {
          const errorMessage = `Error ${response.status}: ${res?.message || response.statusText}`;
          console.error(errorMessage);
          //enqueueSnackbar(errorMessage, { variant: 'error' });
          return res; // Прекращаем выполнение при неудачном статусе
        }
      }

      const data: T = await response.json();
      return data;
    } catch (error: any) {

        return error

    //   if (error instanceof DOMException && error.name === 'AbortError') {
    //     enqueueSnackbar('Request timed out', { variant: 'error' });
    //   } else if (error instanceof Error) {
    //     enqueueSnackbar(error.message, { variant: 'error' });
    //   } else {
    //     enqueueSnackbar('An unknown error occurred', { variant: 'error' });
    //   }
    }
  }

  export function useFetcher<T> (hook: any, initialFetch: boolean = false) {
  
      const [data, setData] = useState<T | null>(null)

      const [isLoading, setIsLoading] = useState<boolean>(false)
  
      const onSuccess = useCallback(
        (res: T) => {
          setData(res)
          setIsLoading(false)
      }, [])
  
      const onError = useCallback(
        () => {
          setData(null)
          setIsLoading(false)
      }, []);
  
      const fetcher = Object.values(hook(apiFetch, onSuccess, onError))[0];
      
      const handler = () => {
        if (typeof fetcher === 'function') {
          setIsLoading(true)
          fetcher()
        }
      }

      if (
        typeof fetcher === 'function' 
        && initialFetch) {
         fetcher()
      }
      return { handler, data, isLoading }
    }