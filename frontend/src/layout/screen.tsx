import { FC, PropsWithChildren } from "react";

const Screen: FC <PropsWithChildren> = ({ children }) => {
    return  <div className="screen">
      {/*<img src="bg.png" alt="bg"/>*/}
        {children}
  </div>
}
export default Screen