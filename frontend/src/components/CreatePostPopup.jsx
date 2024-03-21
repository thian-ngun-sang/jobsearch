import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import coverImage from "../assets/images/defaults/cover_image.jpg";

function CreatePostPopup({ createPostPopupRef, closeCreatePostPopup }){
	const [fileStatus, setFileStatus] = useState(false);

	function handlePostInputFile(event){
		// console.log(event.target.files.length);
		if(event.target.files.length){
			setFileStatus(true);
		}
	}

	let createPostPopupClass = fileStatus
		? "create-post-popup create-post-popup-with-file"
		: "create-post-popup create-post-without-file";

	let createPostFormClass = fileStatus
		? "create-post-form create-post-form-with-file"
		: "create-post-form create-post-form-without-file";

	return <div className={createPostPopupClass}
						ref={createPostPopupRef}>

							<div className="d-flex justify-content-between">
								<div>Create post</div>
								<span className="cursor-pointer" onClick={closeCreatePostPopup}>
									<FontAwesomeIcon className="c-icon" icon={faXmark}/>
								</span>
							</div>

							<div className="mt-2">
								<form className={createPostFormClass}>
									<div>
										<textarea className="create-post-textarea w-100" placeholder="What's on your mind"></textarea>
									</div>
									{ fileStatus && <div className="d-flex justify-content-center">
										<img className="create-post-file" src={coverImage}/>
									</div> }
									<div className="d-flex justify-content-between">
										<label htmlFor="post-file-input" className="text-like-btn app-popup-background cursor-pointer">
											<input id="post-file-input" type="file" className="d-none" onChange={handlePostInputFile}/>
											Add photos and videos
										</label>
										<button type="button" className="text-like-btn app-popup-background">
											Submit
										</button>
									</div>
								</form>
							</div>
	</div>
}

export default CreatePostPopup;
