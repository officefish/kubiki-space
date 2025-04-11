
import {FC, PropsWithChildren, useEffect, useState} from "react"
import {useTranslation} from "react-i18next";

const Loading: FC = () => {

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="loader"></div>
    </div>

  )
}

interface ILoadingProps {
  isLoading: boolean
}

export default Loading

export const WithLoader: FC<PropsWithChildren<ILoadingProps>> = (props) => {

    const { isLoading, children } = props

    return isLoading
        ? <div className="
        w-full h-full flex items-center justify-center
        ">
            <div className="loader"></div>
        </div>
        : <>{children}</>
}