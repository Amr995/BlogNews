const HeaderLeft = ({ toggle, setToggle }) => {
    return ( 
        <div className="header-left">
            <div className="header-logo">
                <strong>Motor's News</strong>
                <i className="bi bi-pencil"></i>
            </div>
            <div onClick={() => setToggle(prev => !prev)} className="header-menu">
                {toggle ? <i className="bi bi-x"></i> : <i className="bi bi-list"></i>}
            </div>
        </div>
    );
}
 
export default HeaderLeft;