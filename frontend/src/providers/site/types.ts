import {
    Page,
  } from "@/types"
  export type PageNotificationType = Page.DASHBOARD | Page.SETTINGS

  export interface IStoreState {
    page: Page
    isLoading: number
    isFooterTransparent: boolean
    isEmptyPage: boolean
  }

  export interface IStoreActions {
    setPage: (page: Page) => void
    addLoading: () => void
    removeLoading: () => void
    hideLoading: () => void
    setIsFooterTransparent: (isTransparent: boolean) => void
    setIsEmptyPage: (isEmptyPage: boolean) => void
  }