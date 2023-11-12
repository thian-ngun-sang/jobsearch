import likeIcon from "../assets/icons/svgs/like.svg";
import loveIcon from "../assets/icons/svgs/love.svg";
import sadIcon from "../assets/icons/svgs/sad.svg";
import angryIcon from "../assets/icons/svgs/angry.svg";

import commentIcon from "../assets/icons/svgs/comment.svg";
import shareIcon from "../assets/icons/svgs/share.svg";
import { useState } from "react";

function Upshot({toggleCommentForm}){
    const [reactionPopupState, setReactionPopupState] = useState(false);
    const [commentFormState, setCommentFormState] = useState(true);

    // reaction list template
    const reactionList = (
        <div className="d-flex reaction-popup">
            <span>
                <img src={likeIcon} alt={likeIcon} className="custom-icon-xl"/>
            </span>
            <span>
                <img src={loveIcon} alt={likeIcon} className="custom-icon-xl"/>
            </span>
            <span>
                <img src={sadIcon} alt={likeIcon} className="custom-icon-xl"/>
            </span>
            <span>
                <img src={angryIcon} alt={likeIcon} className="custom-icon-xl"/>
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
                    <img className="custom-icon-xl" onMouseEnter={showReactionPopup} src={likeIcon} alt={likeIcon}/>
                </span>
                <span className="text-center">
                    <img className="custom-icon-xl" src={commentIcon} alt={commentIcon}/>
                </span>
                <span className="text-end me-2">
                    <img className="custom-icon-xl" src={shareIcon} alt={shareIcon}/>
                </span>
            </div>
            {/* { commentFormState && commentForm } */}
        </div>
        
    );
}

export default Upshot;
