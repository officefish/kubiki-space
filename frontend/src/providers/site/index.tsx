import { FC, PropsWithChildren, useRef, useContext } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { createContext } from 'react' // from 'zustand/context'
import { IStoreState, IStoreActions } from './types'
import { Page } from '@/types'

type IStore = IStoreState & IStoreActions

const createSiteStore = () =>
  createStore<IStore>()((set) => ({
    page: Page.DASHBOARD,
    setPage: (page: Page) => set(() => ({ page })),
    isLoading: 0,
    addLoading: () => set((state) => ({ isLoading: state.isLoading + 1 })),
    removeLoading: () => set((state) => ({ isLoading: state.isLoading - 1 })),
    hideLoading: () => set(() => ({ isLoading: 0 })),   
    isFooterTransparent: false,
    setIsFooterTransparent: (isTransparent: boolean) => set(() => ({ isFooterTransparent: isTransparent })),
    isEmptyPage: false,
    setIsEmptyPage: (isOpen: boolean) => set(() => ({ isEmptyPage: isOpen })),
    
  }))

type Store = ReturnType<typeof createSiteStore>
const SiteContext = createContext<Store | null>(null)

//eslint-disable-next-line react-refresh/only-export-components
export const useSiteStore = () => {
  const api = useContext(SiteContext) as StoreApi<IStore>
  return {
    page: useStore(api, (state: IStore) => state.page),
    setPage: useStore(api, (state: IStore) => state.setPage),
    isLoading: useStore(api, (state: IStore) => state.isLoading),
    addLoading: useStore(api, (state: IStore) => state.addLoading),
    removeLoading: useStore(api, (state: IStore) => state.removeLoading),
    isFooterTransparent: useStore(api, (state: IStore) => state.isFooterTransparent), 
    setIsFooterTransparent: useStore(api, (state: IStore) => state.setIsFooterTransparent),
    isEmptyPage: useStore(api, (state: IStore) => state.isEmptyPage),  // new prop
    setIsEmptyPage: useStore(api, (state: IStore) => state.setIsEmptyPage),
  }
}

export const useLoaderStore = () => {
  const { addLoading, removeLoading, isLoading } = useSiteStore()
  return { addLoading, removeLoading, isLoading }
}

export const SiteProvider: FC<PropsWithChildren> = ({ children }) => {
  const userStoreRef = useRef<Store>()
  if (!userStoreRef.current) {
    userStoreRef.current = createSiteStore()
  }
  return (
    <SiteContext.Provider value={userStoreRef.current}>
      {children}
    </SiteContext.Provider>
  )
}