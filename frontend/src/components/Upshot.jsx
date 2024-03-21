import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faMessage, faShare, faFaceSadTear, faFaceFrown, faHeart } from "@fortawesome/free-solid-svg-icons";

import { useState, useRef } from "react";

function Upshot({toggleCommentForm, openSharePopup, closeSharePopup}){
    const [reactionPopupState, setReactionPopupState] = useState(false);
    const [commentFormState, setCommentFormState] = useState(true);

		const sharePopupRef = useRef(null);

    // reaction list template
    const reactionList = (
        <div className="d-flex reaction-popup">
						<span className="cursor-pointer">
							<FontAwesomeIcon className="c-icon text-dark" icon={faThumbsUp}/>
						</span>
            <span className="cursor-pointer">
								<FontAwesomeIcon className="c-icon text-dark" icon={faHeart}/>
            </span>
            <span className="cursor-pointer">
							<FontAwesomeIcon className="c-icon text-dark" icon={faFaceSadTear}/>
            </span>
            <span className="cursor-pointer">
								<FontAwesomeIcon className="c-icon text-dark" icon={faFaceFrown}/>
            </span>
        </div>
    )

    // comment form template
    const commentForm = (
        <div className="d-flex mt-2 comment-popup">
            <textarea className="comment-textarea" placeholder="What's on your opion"></textarea>
            <div className="ms-2">
                <button>Comment</button>
            </div>
        </div>
    )

    const showReactionPopup = () => {
        setReactionPopupState(true)
    }

    const hideReactionPopup = () => {
        setReactionPopupState(false)
    }

    return (
        <div>
            <div className="upshots-layout">
                <span className="text-start ms-2" onMouseLeave={hideReactionPopup}>
                    { reactionPopupState && reactionList }
										<span className="custom-icon-xl" onMouseEnter={showReactionPopup}>
											<FontAwesomeIcon className="c-icon" icon={faThumbsUp}/>
										</span>
                </span>
                <span className="text-center">
										<span className="custom-icon-xl" onClick={toggleCommentForm}>
											<FontAwesomeIcon className="c-icon" icon={faMessage}/>
										</span>
                </span>
                <span className="text-end me-2">
										<span className="custom-icon-xl" onClick={openSharePopup}> 
												<FontAwesomeIcon className="c-icon" icon={faShare} />
										</span>
                </span>
            </div>
        </div>
        
    );
}

export default Upshot;
