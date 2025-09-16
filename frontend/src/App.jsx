import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./auth_context";

import Login from './views/Login';
import Register from './views/Register';
// import Home from './views/Home';
import Chat from './views/Chat';
import Account from './views/Account';
import EditProfile from './views/EditProfile';
import ChangePassword from './views/ChangePassword';
import NotFound from './views/NotFound';
import Jobs from './views/Jobs';
import CreateJob from './views/CreateJob';
import SavedJobs from './views/SavedJobs';
import CreatePost from './views/CreatePost';

import Authenticate from "./components/Authenticate";
import Authorize from './components/Authorize';
import AppLayout from './components/AppLayout';
import SingleChat from './components/SingleChat';
import SingleStory from './components/SingleStory';

import './App.css';

function App() {
	const auth_data = useContext(AuthContext);
	const { appBackgroundMode, setAppBackgroundMode } = auth_data;
	const [ appThemeClassName, setAppThemeClassName ] = useState("");

	let appTheme = localStorage.getItem("appColorScheme");

	let appThemeMap = {
		"default": "default-color-scheme",
		"system": "system-color-scheme",
		"light": "light-color-scheme",
		"dark": "dark-color-scheme"
	}

	useEffect(() => {
		if(appTheme){ // default is "default"
			setAppBackgroundMode(appTheme);
		}
	}, []);

	useEffect(() => {
		setAppThemeClassName(appThemeMap[appTheme] || appThemeMap['default']);
		const body = document.getElementsByTagName("body")[0];

		let oldClassNames = body.classList;
		if(oldClassNames.length){
			body.classList.replace(oldClassNames[0], appThemeMap[appBackgroundMode] || appThemeMap['default']);
		}else{
			body.classList.add(appThemeMap[appBackgroundMode] || appThemeMap['default']);
		}
	}, [appBackgroundMode]);

  return (
    <div className={`App w-100`}>
        <BrowserRouter>
            <Routes>
                {/* Get to know who the useris */}
                <Route path="/" element={<Authenticate/>}>
                    <Route path="/" element={<Authorize/>}>
                        <Route path="/" element={<AppLayout/>}>
                            <Route index path="/" element={<Jobs/>}/>
                            <Route path="/create-post" element={<CreatePost/>}/>

														{/* <Route path="/jobs" element={<Jobs/>}/> */}
                            <Route path="/create-job" element={<CreateJob/>}/>
                            <Route path="/saved-jobs" element={<SavedJobs/>}/>

                            <Route path="/account" element={<Account/>}/>

                            <Route path="/chat" element={<Chat/>}/>
                            <Route path="/chat/:id" element={<SingleChat/>}/>
                            <Route path="/story/:id" element={<SingleStory/>}/>
                        </Route>
                        <Route path="/account/edit" state="hello" element={<EditProfile/>}/>
                        <Route path="/account/change-password" element={<ChangePassword/>}/>
                    </Route>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
