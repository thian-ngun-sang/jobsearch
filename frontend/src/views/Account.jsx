import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";
import defaultCoverImage from "../assets/images/defaults/cover_image.jpg";

// import cameraIcon from "../assets/icons/svgs/camera-plus.svg";
import cameraIcon from "../assets/icons/svgs/camera-white.svg";
import closeWhiteIcon from "../assets/icons/svgs/close-white.svg";
import tickIcon from "../assets/icons/svgs/tick-white.svg";

import { AuthContext } from "../auth_context";

function Account(){
    const context = useContext(AuthContext);
    const { user, baseUrl } = context;
    
    /*
        data -> the file itself
        url -> the result of file read
    */
    const [profileImage, setProfileImage] = React.useState({
        data: {},
        url: "",
        editState: false
    });
    const [coverImage, setCoverImage] = React.useState({
        data: {},
        url: "",
        editState: false
    });
    const [editOptionState, setEditOptionState] = React.useState(false);

		const accountOptionRef = useRef(null);
		const accountOptionEllipsis = useRef(null);

    // account option template
    const accountOption = <div className="account-edit-option app-background" ref={accountOptionRef}>
        <ul className="custom-list">
            <li>
                <Link className="custom-link" to="/account/edit">Edit Profile</Link>
            </li>
        </ul>
    </div>;

    const imageTypes = ["image/jpeg", "image/png"];

    const reader = new FileReader();
    function validateAndReadImage(arg){
        const file = arg.target.files[0];
        if(imageTypes.includes(file.type)){
            reader.readAsDataURL(file);
            return true;
        }else{
            return false;
        }
    }

    function changeCoverImage(event){
        // console.log(event.target.files[0]);
        let file = validateAndReadImage(event);
        if(!file){
            alert("Invalid file type");
            return 1;
        }
        reader.onload = () => {
            setCoverImage(prev => {
                return {
                    ...prev,
                    data: event.target.files[0],
                    url: reader.result,
                    editState: true
                }
            });
        }
    }

    function changeProfileImage(event){
        let file = validateAndReadImage(event);
        if(!file){
            alert("Invalid file type");
            return 1;
        }

        reader.onload = () => {
            setProfileImage({
                data: event.target.files[0],
                url: reader.result,
                editState: true
            });
        }
    }

    function openAccountOption(){
        setEditOptionState(prevState => !prevState);
    }

    function saveCoverImage(){
        const formData = new FormData();
        formData.append('coverImage', coverImage.data);

        axios.post('/api/account/change-cover-image', formData )
            .then(res => {
                const coverImage = res.data.filename;
                user.cover_image = coverImage;
                setCoverImage({
                    data: {},
                    url: "",
                    editState: false})

            })
            .catch(err => console.log(err))
    }

    function cancelCoverImageSave(){
        setCoverImage({
            data: {},
            url: "",
            editState: false
        });
    }

    function saveProfileImage(){
        const formData = new FormData();
        formData.append("profileImage", profileImage.data);
        axios.post('/api/account/change-profile-image', formData)
            .then(res => {
                const profileImage = res.data.filename;
                user.profile_image = profileImage;
                setProfileImage({
                    data: {},
                    url: "",
                    editState: false
                })
            })
            .catch(err => console.log(err))
    }

    function cancelProfileImageSave(){
        setProfileImage({
            data: {},
            url: "",
            editState: false
        });
    }

    // validate file url
    function validateSrc(src){
        const srcReg = /[a-zA-Z0-9-_]*\.[a-z]+$/;
        let result = srcReg.test(src);
        return result;
    }

		function mousedownOutsideAccountOption(event){

			if(accountOptionRef.current){
				if(!accountOptionRef.current.contains(event.target)
					&& !accountOptionEllipsis.current.contains(event.target) // the button that triggers 'setEditOptionState'
					&& editOptionState){
						setEditOptionState(false);
						document.removeEventListener("mousedown", mousedownOutsideAccountOption);
				}
			}else{
				// console.log("account option no longer exists");
				document.removeEventListener("mousedown", mousedownOutsideAccountOption);
			}

		}

    useEffect(() => {
        const handleScroll = () => {
            if (editOptionState) {
                setEditOptionState(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [editOptionState]);

		useEffect(() => {
			if(accountOptionRef.current){
				document.addEventListener("mousedown", mousedownOutsideAccountOption);
			}
		}, [accountOptionRef.current, editOptionState]);

    return (
        <div>
            <div className="position-relative">
                <div className="cover-image-container">
                    { coverImage.editState
                        ?<>
                            <img className="cover-image" alt="cover" src={coverImage.url || defaultCoverImage}/>

                            <div className="cover-camera-wrapper">
                                <img className="custom-icon-lg cover-camera" onClick={cancelCoverImageSave} src={closeWhiteIcon} alt="cancel-cover"/>
                                <img className="custom-icon-lg cover-camera ms-1" onClick={saveCoverImage} src={tickIcon} alt="save-icon"/>
                            </div>
                        </>
                        :<>
                            { validateSrc(user.cover_image)
                                ?<img className="cover-image" alt="cover" src={`${baseUrl}/storage/user/coverImages/${user.id}/${user.cover_image}`}/>
                                :<img className="cover-image" alt="cover" src={defaultCoverImage}/> }
                            
                            <div className="cover-camera-wrapper">
                                <label htmlFor="account--cover-image">
                                    <img className="custom-icon-lg cover-camera" alt="camera-icon" src={cameraIcon}/>
                                </label>
                                <input className="d-none" id="account--cover-image" name="coverImage" type="file" onChange={changeCoverImage}/>
                            </div>
                        </> }
                </div>
                <div className="profile-banner-layout">
                    <div>
                        { profileImage.editState
                            ? <div className="profile-image-container">
                                <img className="rounded-circle profile-image" alt="profile"  src={profileImage.url || femaleDefaultProfile}/>

                                <img className="anti-profile-camera position-absolute rounded-circle custom-icon-lg" onClick={cancelProfileImageSave} src={closeWhiteIcon} alt="cancel-cover"/>
                                <img className="profile-camera position-absolute rounded-circle custom-icon-lg" onClick={saveProfileImage} src={tickIcon} alt="tick-icon"/>
                            </div>
                            : <div className="profile-image-container">
                                { validateSrc(user.profile_image)
                                    ? <img className="rounded-circle profile-image" alt="profile" src={`${baseUrl}/storage/user/profileImages/${user.id}/${user.profile_image}`}/>
                                    : <img className="rounded-circle profile-image" alt="female-default-profile" src={femaleDefaultProfile}/> }
                                
                                <label htmlFor="account--profile-image">
                                    <img className="profile-camera custom-icon-lg position-absolute rounded-circle" alt="camera-icon" src={cameraIcon}/>
                                </label>
                                <input className="d-none" name="profileImage" id="account--profile-image" type="file" onChange={changeProfileImage}/>
                            </div> }
                    </div>
                    
                    <div className="d-flex justify-content-between w-100 account--user-detail">
                        <div className="custom-ms-3 mt-1">
                            <h4>{ user.first_name } { user.last_name }</h4>
                            <ul className="user-details">
                                <li>Technological University(Kalay)</li>
                                <li>Kalaymyo, Sagaign, Burma</li>
                            </ul>
                        </div>

                        <div className="account-edit-option-ctn">
														<span className="cursor-pointer" onClick={openAccountOption} ref={accountOptionEllipsis}>
															<FontAwesomeIcon className="c-icon" icon={faEllipsis} />
														</span>
                            { editOptionState && accountOption }
                        </div>
                    </div>
                    
                </div>
						</div>

        </div>
    );
}

export default Account;
