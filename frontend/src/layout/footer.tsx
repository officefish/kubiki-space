import { FC, PropsWithChildren } from "react";
import {useSiteStore} from "@/providers/site";

const Footer: FC <PropsWithChildren> = ({ children }) => {
    const { isFooterTransparent } = useSiteStore()


    return <footer className="w-full fixed bottom-0" style={{background: isFooterTransparent ? 'transparent' : ''}}>
        {children}
    </footer>
}
export default Footer