import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

// import backIcon from "../assets/icons/svgs/back.svg";

import AuthLayout from "../components/AuthLayout";

function ChangePassword(){

    const navigate = useNavigate();

    const [ userData, setUserData ] = useState({
        password: "",
        password2: "",
        password3: ""
    });

		const [ httpErrorMessage, setHttpErrorMessage ] = useState("");
		const [ isSubmitted, setIsSubmitted ] = useState(false);

    function handleChange(event){
        const target = event.target;
        setUserData((oldState) => {
            return {
                ...oldState,
                [target.name]: target.value
            };
        })
    }

    function submitForm(event){
        event.preventDefault();
				setIsSubmitted(true);

				if(userData.password === "" || userData.password2 === "" || userData.password3 === ""){
					return null;
				}

        axios.patch(`/api/account/change-password`, userData)
            .then(res => {
							const { msg } = res.data;
							navigate("/account");
							console.log(msg);
            })
            .catch(err => {
							const { msg } = err.response.data;
							if(msg !== null && msg !== undefined){
								if(httpErrorMessage !== msg){
									setHttpErrorMessage(msg);
								}
							}
						})
    }

    function back(){
        navigate(-1);
    }

    return (
        <AuthLayout>
					<div className="change-password-form">
						{/* <img className="custom-icon-xl" alt={backIcon} src={backIcon} onClick={back}/> */}
						<span className="cursor-pointer" onClick={back}>
							<FontAwesomeIcon className="c-icon" icon={faArrowLeft}/>
						</span>
            <form onSubmit={submitForm}>
                <div className="custom-input-container">
                    <label className="custom-label">Old Password</label>
                    <input className={ isSubmitted && userData.password === "" ? "custom-input-error" : "custom-input" }
												name="password" value={userData.password}
                        onChange={handleChange} type="password" placeholder="Old Password"/>
                </div>
                <div className="custom-input-container">
                    <label className="custom-label">New Password</label>
                    <input className={ isSubmitted && userData.password2 === "" ? "custom-input-error" : "custom-input" }
												name="password2" value={userData.password2}
                        onChange={handleChange} type="password" placeholder="New Password"/>
                </div>
                <div className="custom-input-container">
                    <label className="custolm-label">Confirm Password</label>
                    <input className={ isSubmitted && userData.password3 === "" ? "custom-input-error" : "custom-input" } name="password3" value={userData.password3}
                        onChange={handleChange} type="password" placeholder="Confirm Password"/>
                </div>
                <div className="text-end">
                    <button className="custom-button-green">Update</button>
                </div>
								<div>
									{ httpErrorMessage !== "" 
										&& <div className="text-danger">{ httpErrorMessage }</div> }
								</div>
            </form>
					</div>
        </AuthLayout>
    );
}

export default ChangePassword;
