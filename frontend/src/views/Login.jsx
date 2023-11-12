import { Link, Navigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth_context";

import AuthLayout from "../components/AuthLayout";

function Login(){
    const [ userData, setUserData ] = useState({
        email: "",
        username: "",
        password: "",
				phoneNumber: ""
    });
		const [submitted, setSubmitted] = useState(false);
		const [httpErrorMessage, setHttpErrorMessage] = useState("");
		    
    const authData = useContext(AuthContext);
    const { storeToken, user } = authData;
    if(Object.keys(user).length){
        return (
            <Navigate to="/account"/>
        );
    }

    function handleChange(event){
        const target = event.target;
        setUserData((prev) => {
            return {
                ...prev,
                [target.name]: target.value
            };
        })
    }

    function submitForm(event){
        event.preventDefault();
				setSubmitted(true);

				if(userData.email === "" || userData.password === ""){
					return;
				}

				let formData;
				const { username, phoneNumber, ...form } = userData;
				formData = form;

        axios.post("/api/user/login", formData)
            .then(response => {
                const data = response.data;
                const { token } = data;


								if(token !== undefined && token !== null && token !== ""){
									storeToken(token); // save to local storage
								}
                setUserData({
                        email: "",
                        username: "",
                        password: ""
                });
            })
            .catch(error => {
							const { msg } = error.response.data;
							if(msg !== undefined && msg !== null){
								console.log(msg);
								setHttpErrorMessage(msg);
							}
						})
    }

    return (
            <AuthLayout>
                <div className="login-form">
                    <h3 className="text-center">Welcome to Jobsearch</h3>
                    <div>
                        <form onSubmit={submitForm}>
                            <div className="custom-input-container">
                                <label className="custom-label">Email</label>
                                <input className="custom-input" name="email" value={userData.email}
                                    onChange={handleChange} type="email" placeholder="Email"/>
																{ submitted && userData.email === ""
																	&& <span className="text-danger">Email cannot be null</span> }
                            </div>
                            <div className="custom-input-container">
                                <label className="custom-label">Password</label>
                                <input className="custom-input" name="password" value={userData.password}
                                    onChange={handleChange} type="password" placeholder="Password"/>
																{ submitted && userData.password === ""
																	&& <span className="text-danger">Password cannot be null</span> }
                            </div>
                            <div className="d-flex justify-content-between">
																<div></div>
																<div className="text-danger">
																	{ httpErrorMessage && httpErrorMessage }
																</div>
                                <button type="submit" className="custom-button-green justify-content-center">Login</button>
                            </div>
														
                        </form>
                    </div>
										<div>
												<span>You don't have an account?</span>
												<Link to="/register" className="ms-1">Register here</Link>
										</div>
                </div>
            </AuthLayout>
            );
}

export default Login;
