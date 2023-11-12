import React from "react";
import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { AuthContext } from "../auth_context";

import AuthLayout from "../components/AuthLayout";

import backIcon from "../assets/icons/svgs/back.svg";

function EditProfile(){
    const authContext =  useContext(AuthContext);
    const { user, setUser } = authContext;
    const navigate = useNavigate();
    
    const [ userData, setUserData ] = useState(
        {
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            user_name: user.user_name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || ""
        });
		const [httpErrorList, setHttpErrorList] = useState([]);
        
    function handleOnChange(event){
        const target = event.target;
        setUserData((prevState, newState) => {
            return {
                ...prevState,
                [target.name]: target.value
            };
        })
    }

    function stepBack(){
        navigate(-1);
    }

    function submitForm(event){
        event.preventDefault();
        
        axios.post(`/api/account/update/${user.id}`, userData)
            .then(res => {
                const { user: updatedUser } = res.data;
                setUser({
                    ...user,
                    ...updatedUser
                })
                return navigate("/account");
            })
            .catch(err => {
								const { msg } = err.response.data;
								if(msg !== null && msg !== undefined){
									if(!httpErrorList.includes(msg)){
										setHttpErrorList(prev => {
											return [ msg ]; 
										})
									}
								}
            })
    }

    return (
        <AuthLayout>
            {/* <button>Back</button> */}
						<div className="account-edit-form">
							{/* <img className="custom-icon-xl" alt={backIcon} onClick={stepBack} src={backIcon}/> */ }
							{/* <FontAwesomeIcon icon="fa-solid fa-arrow-left" /> */}
							<FontAwesomeIcon className="c-icon cursor-pointer" onClick={stepBack} icon={ faArrowLeft } />
							<form onSubmit={submitForm}>
									<div className="custom-input-container">
											<label className="custom-label">Firstname</label>
											<input className="custom-input" name="first_name"
													onChange={handleOnChange} value={userData.first_name} type="text" placeholder="First Name"/>
									</div>
									<div className="custom-input-container">
											<label className="custom-label">Lastname</label>
											<input className="custom-input" name="last_name"
													onChange={handleOnChange} value={userData.last_name} type="text" placeholder="Last Name"/>
									</div>
									<div className="custom-input-container">
											<label className="custom-label">Username</label>
											<input className="custom-input" name="user_name"
													onChange={handleOnChange} value={userData.user_name} type="text" placeholder="User Name"/>
									</div>
									<div className="custom-input-container">
											<label className="custom-label">Email</label>
											<input className="custom-input" name="email" value={userData.email}
													onChange={handleOnChange} type="email" placeholder="Email"/>
									</div>
									<div className="custom-input-container">
											<label className="custom-label">Phone</label>
											<input className="custom-input" name="phone" value={userData.phone}
													onChange={handleOnChange} type="text" placeholder="Phone"/>
									</div>
									<div className="custom-input-container">
											<label className="custom-label">Address</label>
											<input className="custom-input" name="address" value={userData.address}
													onChange={handleOnChange} type="text" placeholder="Country, State, City"/>
									</div>
									<div className="text-end">
											<button className="custom-button-green">Update</button>
									</div>
									<div>
										{ httpErrorList.length > 0
											&& httpErrorList.map((error, index) => <div className="text-danger" key={index}>{ error }</div>) }
									</div>
							</form>
						</div>
        </AuthLayout>
    );
}

export default EditProfile;
