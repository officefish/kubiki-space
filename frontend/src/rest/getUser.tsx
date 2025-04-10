import { useCallback } from 'react'
//import { useSnackbar } from 'notistack' // Assuming you're using notistack for notifications
//import { useUserStore } from '@/providers/user';
import { apiFetch } from '@/services/api.fetch';

export const useGetUser = (onSuccess?: (response: any) => void, onError?: (error: any) => void) => {
  //const { enqueueSnackbar } = useSnackbar();

  //const { setDailyQuest, setMinigame } = useUserStore();

  const getUser = useCallback(
    async () => {

      try {
        const res = await apiFetch('/user', 'GET', null);
        
        if (res) {
            console.log(res)
            onSuccess && onSuccess(res);
        } else {
            //enqueueSnackbar('Failed to fetch stats', { variant: 'error' });
            onError && onError(new Error('Failed to fetch stats'));
        }
        
      } catch (error: any) {
        //enqueueSnackbar(`Error during allQuestsInfo: ${error}`, { variant: 'error' });
        onError && onError(error);
      } finally {
        
      }
    },
    [
        apiFetch, 
        //enqueueSnackbar
    ] // Dependencies
  )

  return { getUser }
}