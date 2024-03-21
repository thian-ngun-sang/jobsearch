import { useEffect, useContext, useRef } from "react";

import { AuthContext } from "../auth_context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";

const SharePopup = ({post, sharePopupRef, closeSharePopup, shareFormText, setShareFormText}) => {
	const shareFormTextareaRef = useRef(null);
	const context = useContext(AuthContext);
	const { user, baseUrl } = context;

	function validateSrc(src){
			const srcReg = /[a-zA-Z0-9-_]*\.(jpg|jpeg|png)$/;
			let result = srcReg.test(src);
			return result;
	}

	function timeAgo(date){
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

	function handleShareContentKeyup(event){
		setShareFormText(event.target.value);
	}

	useEffect(() => {
			let valueInJson = JSON.stringify(shareFormText);
			var textarea = shareFormTextareaRef.current;

			// new line character count in textarea
			const newLineCount = valueInJson.split("\\n").length - 1;
			if(newLineCount === 0){
				textarea.rows = 1;
				textarea.style.height = textarea.rows + 0.9 + 'rem';
			}else if(newLineCount < 3){
				// textarea.style.height = newLineCount + 1 + 0.9 + 'rem';
				textarea.rows = newLineCount + 1;
				textarea.style.height = textarea.rows + 1.5 + 'rem';
			}
	}, [shareFormText]);

	return <div className="share-popup" ref={sharePopupRef}>
						<div className="text-end">
							<span className="cursor-pointer" onClick={closeSharePopup}>
								<FontAwesomeIcon className="c-icon" icon={faXmark}/>
							</span>
						</div>

						<div className="mb-2 d-flex">
							{ validateSrc(user.profile_image)
								? <img className="user-profile" alt="profile"
									src={baseUrl + "/storage/user/profileImages/" + user.id + "/" + user.profile_image }/>
								: <img className="user-profile" alt="profile" src={femaleDefaultProfile}/>
							}
							<textarea id="share-form-textarea" className="share-post-textarea height-change-smooth ms-2 mt-2"
								placeholder="What's on your mind" onChange={handleShareContentKeyup}
								ref={shareFormTextareaRef} value={shareFormText}></textarea>
						</div>
						

						<div className="position-relative share-post-child">
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
											{/* <span className="cursor-pointer" onClick={togglePostDropdown}>
													<FontAwesomeIcon className="c-icon" icon={faEllipsis}/>
												</span>
												<span className="cursor-pointer c-ms-2">
													<FontAwesomeIcon className="c-icon" icon={faXmark}/>
												</span>

												{ postDropdownState && postDropdown } */}
										</div>
								</div>
								<div>
										<p className="post-body">
											{ post?.body }
										</p>
										{ post.files && <img className="share-post-image" src={baseUrl + "/storage/uploads/posts/" + post.files[0] } alt="post"/> }
								</div>
						</div>
	</div>
}

export default SharePopup;
