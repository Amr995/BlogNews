import { useState } from "react";
import "./header.css";
import Navbar from "./Navbar";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";

const Header = () => {
// eslint-disable-next-line
    const [toggle, setToggle] = useState(false);

    return ( 
        <header className="header">

            <HeaderLeft toggle={toggle} setToggle={setToggle}/>
            <Navbar toggle={toggle} setToggle={setToggle}/>
            <HeaderRight toggle={toggle} setToggle={setToggle}/>

        </header>
     );
}

export default Header;