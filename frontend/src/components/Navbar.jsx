import { NavLink, useSearchParams, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../auth_context";

function Navbar(){
    const setSearchParams = useSearchParams()[1];
    const [q, setQ] = useState("");
    const [logoutRequest, setLogoutRequest] = useState(false);
    const [accountDropdownState, setAccountDropdownState] = useState(false);
    const [searchInputIsOpen, setSearchInputIsOpen] = useState(false);
    const [settingsState, setSettingsState] = useState(false);
    const [localColorScheme, setLocalColorScheme] = useState("");

    const logoutConfirmRef = useRef(null);
    const accountDropdownRef = useRef(null);
    const accountDropdownToggleRef = useRef(null);

    const location = useLocation();

    const context = useContext(AuthContext);
    const { setSearchState, logout,
					appBackgroundMode, setAppBackgroundMode} = context;

    function hidePopups(){
        if(logoutRequest){
            setLogoutRequest(false);
        }
        if(accountDropdownState){
            setAccountDropdownState(false);
        }
    }

    useEffect(() => {
        setSearchState(false);
        setQ("");
        hidePopups();
    }, [location.pathname]);

    useEffect(() => {
        window.addEventListener("scroll", hidePopups);
        return () => {
            window.removeEventListener("scroll", hidePopups);
        }
    }, [logoutRequest, accountDropdownState]);

		useEffect(() => {
			setLocalColorScheme(appBackgroundMode);
		}, []);

    function handleSearch(event){
        setQ(event.target.value);
    }

    function searchKeyUp(event){
        let value = event.target.value;
        if(event.key === "Enter"){
            setSearchState(true);
            if(value !== ""){
                setSearchParams(`q=${event.target.value}`);
            }else if(value === ""){
                setSearchParams(``);
            }
        }
    }

    function handleClickOutside(event){
        if (logoutConfirmRef.current && !logoutConfirmRef.current.contains(event.target)) {
            setLogoutRequest(false);
            document.removeEventListener("mousedown", handleClickOutside);
        }

        if(accountDropdownRef.current && !accountDropdownRef.current.contains(event.target) &&
          accountDropdownToggleRef.current && !accountDropdownToggleRef.current.contains(event.target)){
            setAccountDropdownState(false);
            document.removeEventListener("mousedown", handleClickOutside);
        }
    };

    function toggleLogoutRequest(){
        setLogoutRequest(prev => !prev);
        if(accountDropdownState){
            setAccountDropdownState(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
    }

    function toggleAccountDropdown(){
        setAccountDropdownState(prev => !prev);

        document.addEventListener("mousedown", handleClickOutside);
    }

    function closeAccountDropdown(){
        setAccountDropdownState(false);
    }

		function openSettings(){
			setSettingsState(true);
			setAccountDropdownState(false);
		}

		function handleColorSchemeChange(event){
			let value = event.target.value;
			setAppBackgroundMode(value);
			setLocalColorScheme(value)
		}

		function saveColorScheme(){
			localStorage.setItem("appColorScheme", localColorScheme);
			setSettingsState(false);
		}

    const accountDropdown = <div className="position-absolute text-start app-background account-option" ref={accountDropdownRef}>
            <ul className="custom-list">
                <li>
                    <NavLink className="custom-link text-center" activeclassname="active" to="/account" onClick={closeAccountDropdown}>Profile</NavLink>
                </li>
                <li>
                    <NavLink className="custom-link text-center" activeclassname="active" to="/saved-jobs" onClick={closeAccountDropdown}>Saved Jobs</NavLink>
                </li>
                <li>
                    <NavLink className="custom-link" to="/account/change-password" onClick={closeAccountDropdown}>Change Password</NavLink>
                </li>
                <li>
                		<span className="custom-link cursor-pointer" onClick={openSettings}>Settings</span> 
                </li>
                <li>
                    <span className="custom-link cursor-pointer" onClick={toggleLogoutRequest}>Logout</span>
                </li>
            </ul>
        </div>;

    // logout confirm template
    const logoutConfirm = (<div className="position-absolute logout-confirm app-background" id="logout-confirm-id" ref={logoutConfirmRef}>
        <div className="text-center">
            Are you sure you want to logout?
        </div>
        <div className="text-end">
            <span className="custom-button" onClick={logout}>Yes</span>
            <span className="custom-button ms-2" onClick={toggleLogoutRequest}>No</span>
        </div>
    </div>);

		// settings template
		const settings = <div className="form-popup">
			<div className="position-relative h-100">
				<div className="text-center">Choose color scheme</div>
				<div className="form-popup--header position-absolute">
					<div className="text-end">
						<span className="cursor-pointer" onClick={ () => setSettingsState(false) }>
							<FontAwesomeIcon className="c-icon" icon={faXmark}/>
						</span>
					</div>
				</div>
				<div>
					{/* <select>
						<option>default</option>
						<option>white</option>
						<option>dark</option>
					</select> */}
					<div>

						<div>
							<input type="radio" id="default"
								name="color-scheme"
								onChange={handleColorSchemeChange}
								value="default"
								checked={ appBackgroundMode === "default" }/>
							<label className="ms-1 cursor-pointer" htmlFor="default">
								Default
							</label>
						</div>

						<div>
							<input type="radio" id="system"
								name="color-scheme"
								onChange={handleColorSchemeChange}
								value="system"
								checked={ appBackgroundMode === "system" }/>
							<label className="ms-1 cursor-pointer" htmlFor="system">
								System
							</label>
						</div>

						<div>
							<input type="radio" id="light"
								name="color-scheme"
								onChange={handleColorSchemeChange}
								value="light"
								checked={ appBackgroundMode === "light" }/>
							<label className="ms-1 cursor-pointer" htmlFor="light">
								White
							</label>
						</div>

						<div>
							<input type="radio" id="dark"
								name="color-scheme"
								onChange={handleColorSchemeChange}
								value="dark"
								checked={ appBackgroundMode === "dark" }/>
							<label className="ms-1 cursor-pointer" htmlFor="dark">
								Dark
							</label>
						</div>
					</div>
					<div className="position-absolute form-popup--footer">
					<div className="text-end">
							<button onClick={saveColorScheme} className="custom-button">
								Save
							</button>
					</div>
					</div>
				</div>
			</div>
		</div>

    return (
        <nav className="app-nav app-background fixed-to-app-layout user-select-none">
            <div className="main-nav">
                <div className="lt-260:none">
                    <div className="d-flex justify-content-between">
                        <div className="app-logo gt-260:p-2">
														{/* <h4 className="lt-260:my-0">jobsearch</h4> */}
														<NavLink to="/" className="text-decoration-none fs-5">jobsearch</NavLink>
                        </div>
                        <div className="me-1 position-relative">
                            <label htmlFor="home-search-input">
																{/* <img className="custom-icon-lg home-search-icon" alt={searchIcon} src={searchIcon}/> */}
																<span className="home-search-icon">
																	<FontAwesomeIcon className="c-icon-sm text-dark" icon={faMagnifyingGlass}/>
																</span>
                            </label>
                            <input type="search" placeholder="Search" id="home-search-input" className="home-search-input mt-1" value={q} onChange={handleSearch} onKeyUp={searchKeyUp}/>
                        </div>
                    </div>
                </div>
                <div className="gt-260:none gt-260-none">
                    <div className={!searchInputIsOpen ? "d-flex justify-content-between min-h-25" : "min-h-25"}>
                        { !searchInputIsOpen
                            && <div className="app-logo gt-260:p-2">
                            <h4 className="lt-260:my-0">jobsearch</h4>
                        </div> }

                        <div className="position-relative min-w-25">
                            <label htmlFor="home-search-input">
			{/* <img className="custom-icon-lg home-search-icon" alt={searchIcon} src={searchIcon} onClick={() => setSearchInputIsOpen(true)}/> */}
																<span className="cursor-pointer home-search-icon" onClick={() => setSearchInputIsOpen(true)}>
																	<FontAwesomeIcon className={ searchInputIsOpen ? "c-icon-sm text-dark" : "c-icon-sm" } icon={faMagnifyingGlass}/>
																</span>
                            </label>
                            { searchInputIsOpen
                                && <input type="search" placeholder="Search" id="home-search-input" className="home-search-input mt-1" value={q} onChange={handleSearch} onKeyUp={searchKeyUp}/> }

                            { searchInputIsOpen && <div className="position-absolute close-search-input">
																{/* <img className="cursor-pointer custom-icon" src={closeIcon} onClick={() => setSearchInputIsOpen(false)} alt="close-icon"/> */}
																<span className="cursor-pointer" onClick={() => setSearchInputIsOpen(false)}>
																	<FontAwesomeIcon className="c-icon" icon={faXmark}/>
																</span>
                            </div> }
                        </div>
                    </div>
                </div>
                <ul className="main-nav-layout">
                    <li>
                        <NavLink className="custom-nav-item" activeclassname="active" to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink className="custom-nav-item" activeclassname="active" to="/jobs">Jobs</NavLink>
                    </li>
                    <li>
                        <NavLink className="custom-nav-item" activeclassname="active" to="/saved-jobs">Saved Jobs</NavLink>
                    </li>
										{/*
                    <li>
                        <NavLink className="custom-nav-item" activeclassname="active" to="/chat">Chat</NavLink>
                    </li>
										*/}
                    <li>
                        <span className="custom-nav-item cursor-pointer text-primary" ref={accountDropdownToggleRef} onClick={toggleAccountDropdown}>Account</span>
                        { accountDropdownState && accountDropdown }
                    </li>
                </ul>

                { logoutRequest && logoutConfirm }
								{ settingsState && settings }

            </div>
        </nav>
    );
}

export default Navbar;
