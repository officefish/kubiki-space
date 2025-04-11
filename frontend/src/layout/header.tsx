import { FC } from "react";
//import Navigation from "./nav";
//import Menu from "./menu";

const Header: FC  = () => {
   
    return <header className="flex flex-row items-start justify-between w-full">
        {/* <Navigation /> */}
        {/* <Menu /> */}
        <div className="text-secondary">Navigation</div>
        <div>Menu</div>
    </header>
}
export default Header