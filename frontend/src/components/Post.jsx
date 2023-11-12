import { useState } from "react";

import Upshot from "../components/Upshot";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";
import moreHorizontal from "../assets/icons/svgs/more-horizontal.svg";
import closeMd from "../assets/icons/svgs/close-md.svg";

import img1 from "../assets/images/posts/background05.jpeg";

import CommentPopup from "./CommentPopup";

const Post = () => {

    const [postDropdownState, setPostDropdownState] = useState(false);
    const [commentFormState, setCommentFormState] = useState(false);
    const [commentText, setCommentText] = useState("");

    // post dropdown template
    const postDropdown = (
        <div className="post-dropdown">
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
            </ul>
        </div>
    );

    // toggle post dropdown
    const togglePostDropdown = () => {
        setPostDropdownState(prev => !prev);
    }

    // toggle comment form
    const toggleCommentForm = () => {
        setCommentFormState(prev => !prev);
    }

    return (
        <div className="position-relative">
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <img className="user-profile" src={femaleDefaultProfile}/>
                    <div className="ms-1 post-detail">
                        <span className="d-block">Thian Ngun</span>
                        <small>4 mins ago</small>
                    </div>
                </div>
                <div>
                    <img src={moreHorizontal} alt={moreHorizontal} className="custom-icon-lg" onClick={togglePostDropdown}/>
                    <img src={closeMd} alt={closeMd} className="ms-1 custom-icon-lg"/>
                        { postDropdownState && postDropdown }
                </div>
            </div>
            <div>
                <p className="post-body">
                    Feel about natural beauty
                </p>
                <img className="post-image" src={img1} alt={img1}/>
            </div>
            <div className="mt-2">
                <Upshot toggleCommentForm={toggleCommentForm}/>
            </div>
            {commentFormState && <CommentPopup setCommentFormState={setCommentFormState}/>}
            <hr className="post-horizontal-line"/>
        </div>
    );
}

export default Post;