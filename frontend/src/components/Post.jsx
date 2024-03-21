import { useState, useContext, useEffect, useRef } from "react";


import { AuthContext } from "../auth_context";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";

import Upshot from "../components/Upshot";
import CommentPopup from "./CommentPopup";
import SharePopup from "./SharePopup";

const Post = ({ post }) => {
    const [postDropdownState, setPostDropdownState] = useState(false);
    const [commentFormState, setCommentFormState] = useState(false);
    const [shareFormState, setShareFormState] = useState(false);
    const [commentText, setCommentText] = useState("");
		const [shareFormText, setShareFormText] = useState("");

		const context = useContext(AuthContext);
    const { user, baseUrl } = context;

		const postDropdownRef = useRef(null);
		const commentPopupRef = useRef(null);
		const sharePopupRef = useRef(null);
		const postEllipsesRef = useRef(null);

    // post dropdown template
    const postDropdown = (
        <div className="post-dropdown app-background" ref={postDropdownRef}>
            <ul className="custom-list">
                <li>
                    <span className="custom-link cursor-pointer">Copy link</span>
                </li>
                <li>
                    <span className="custom-link cursor-pointer">Report</span>
                </li>
                <li>
                    <span className="custom-link cursor-pointer">Save post</span>
                </li>
								{ post.user_id === user.id && <li>
                    <span className="custom-link cursor-pointer">Edit post</span>
                </li> }
            </ul>
        </div>
    );

		const clickOutsidePostDropdown = (event) => {
			if(postDropdownRef.current && !postDropdownRef.current.contains(event.target)
				&& !postEllipsesRef.current.contains(event.target)){
				console.log("click outside post dropdown");
				setPostDropdownState(false);
				document.removeEventListener("mousedown", clickOutsidePostDropdown);	
			}
		}

    // toggle post dropdown
    const togglePostDropdown = () => {
        setPostDropdownState(prev => !prev);

				document.addEventListener("mousedown", clickOutsidePostDropdown);	
    }

		const clickOutsideCommentPopup = (event) => {
				// if commentPopupRef.current is not null and click outside commentpop
				if(commentPopupRef.current && !commentPopupRef.current.contains(event.target)){
					setCommentFormState(false);
					document.removeEventListener("mousedown", clickOutsideCommentPopup);	
				}
				
		}

    // toggle comment form
    const toggleCommentForm = () => {
        setCommentFormState(prev => !prev);

				document.addEventListener("mousedown", clickOutsideCommentPopup);	
    }


		const clickOutsideSharePopup = (event) => {
			if(sharePopupRef.current && !sharePopupRef.current.contains(event.target)){
				// console.log("click outside share popup");	
				document.removeEventListener("mousedown", clickOutsideSharePopup);
				closeSharePopup();
			}
		}

		const openSharePopup = () => {
			setShareFormState(true)

			document.addEventListener("mousedown", clickOutsideSharePopup);
		}

		const closeSharePopup = () => {
			setShareFormState(false)
		}


    const timeAgo = (date) => {
        var ms = (new Date()).getTime() - date.getTime();
        var seconds = Math.floor(ms / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var months = Math.floor(days / 30);
        var years = Math.floor(months / 12);

        if (ms === 0) {
            return 'Just now';
        } if (seconds < 60) {
            return seconds + ' seconds ago';
        } if (minutes < 60) {
            return minutes + ' minutes ago';
        } if (hours < 24) {
            return hours + ' hours ago';
        } if (days < 30) {
            return days + ' days ago';
        } if (months < 12) {
            return months + ' months ago';
        } else {
            return years + ' years ago';
        }
    }

    function validateSrc(src){
        const srcReg = /[a-zA-Z0-9-_]*\.(jpg|jpeg|png)$/;
        let result = srcReg.test(src);
        return result;
    }

		useEffect(() => {
			// console.log(commentText);
		}, [commentText]);

    return (
        <div className="position-relative">
            <div className="d-flex justify-content-between">
                <div className="d-flex">
										{ validateSrc(post.user_profile_image)
											? <img className="user-profile" alt="profile"
												src={baseUrl + "/storage/user/profileImages/" + post.user_id + "/" + post.user_profile_image }/>
											: <img className="user-profile" alt="profile" src={femaleDefaultProfile}/>
										}

                    <div className="ms-1 post-detail">
												{ post.user_first_name
													?<span className="d-block">{ post.user_first_name } { post.user_last_name }</span>
													:<span>Job search user</span>
												}
                        <small>{ timeAgo(new Date(post.created_at)) }</small>
                    </div>
                </div>
                <div>
										<span className="cursor-pointer" ref={postEllipsesRef} onClick={togglePostDropdown}>
											<FontAwesomeIcon className="c-icon" icon={faEllipsis}/>
										</span>
										<span className="cursor-pointer c-ms-2">
											<FontAwesomeIcon className="c-icon" icon={faXmark}/>
										</span>

										{ postDropdownState && postDropdown }
                </div>
            </div>
            <div>
                <p className="post-body">
									{ post?.body }
                </p>
								{ post.files && <img className="post-image" src={baseUrl + "/storage/uploads/posts/" + post.files[0] } alt="post"/> }
            </div>
            <div className="mt-2">
                <Upshot toggleCommentForm={toggleCommentForm} openSharePopup={openSharePopup}/>
            </div>

            {commentFormState && <CommentPopup commentText={commentText}
							setCommentText={setCommentText} commentFormState={commentFormState}
							setCommentFormState={setCommentFormState} customRef={commentPopupRef}/>}

						{/* pass ref as sharePopupRef to a component */}
						{shareFormState &&
							<SharePopup post={post} shareFormText={shareFormText} setShareFormText={setShareFormText}
								openSharePopup={openSharePopup} closeSharePopup={closeSharePopup}
								sharePopupRef={sharePopupRef}></SharePopup>
						}
            <hr className="post-horizontal-line"/>
        </div>
    );
}

export default Post;
