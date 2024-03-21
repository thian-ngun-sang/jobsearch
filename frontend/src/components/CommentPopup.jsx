import { useEffect, useRef } from "react";

import nationPark from "../assets/images/posts/kruger_national_park.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


const CommentPopup = ({commentText, setCommentText, commentFormState, setCommentFormState, customRef}) => {
		const commentFormTextareaRef = useRef(null);
		
		const closeCommentPopup = () => {
			setCommentFormState(false);
		}

    const handleComment = (event) => {
				setCommentText(event.target.value);
    }

		useEffect(() => {
				let valueInJson = JSON.stringify(commentText);
			 	var textarea = commentFormTextareaRef.current;

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

		}, [commentText, commentFormState]);

    return (
        <div className="comment-popup" ref={customRef}>
						<div className="text-end">
							<span className="cursor-pointer" onClick={closeCommentPopup}>
								<FontAwesomeIcon className="c-icon" icon={faXmark}/>
							</span>
						</div>
            <div className="comment-list">
							<ul className="custom-list">

								<li>
									<div className="d-flex">
										<img className="user-profile" src={nationPark} alt="user-profile"/>
										<div className="ms-2">
											<div>
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni laudantium aliquam magnam, ab adipisci corporis voluptatum reprehenderit eius repudiandae, aut laboriosam animi at placeat quae ipsam atque eum distinctio in!
											</div>
											<div>
												<span>1d</span>	
											</div>
										</div>
									</div>
								</li>								

								<li>
									<div className="d-flex">
										<img className="user-profile" src={nationPark} alt="user-profile"/>
										<div className="ms-2">
											<div>
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni laudantium aliquam magnam, ab adipisci corporis voluptatum reprehenderit eius repudiandae, aut laboriosam animi at placeat quae ipsam atque eum distinctio in!
											</div>
											<div>
												<span>1d</span>	
											</div>
										</div>
									</div>
								</li>								

								<li>
									<div className="d-flex">
										<img className="user-profile" src={nationPark} alt="user-profile"/>
										<div className="ms-2">
											<div>
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni laudantium aliquam magnam, ab adipisci corporis voluptatum reprehenderit eius repudiandae, aut laboriosam animi at placeat quae ipsam atque eum distinctio in!
											</div>
											<div>
												<span>1d</span>	
											</div>
										</div>
									</div>
								</li>								

							</ul>
            </div>
            <div className="d-flex mt-2">
									<textarea id="myTextarea" className="comment-textarea" ref={commentFormTextareaRef}
									onChange={handleComment} placeholder="What's on your opion" value={commentText}></textarea>
                <div className="ms-2">
                    <button className="text-like-btn app-popup-background">Comment</button>
                </div>
            </div>
        </div>
    );
}

export default CommentPopup;
