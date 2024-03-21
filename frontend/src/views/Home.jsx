import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Post from "../components/Post";
import CommentPopup from "../components/CommentPopup";
import CreatePostPopup from "../components/CreatePostPopup";

function Home(){
    const [commentFormState, setCommentFormState] = useState(true);
		const [createPostState, setCreatePostState] = useState(false);
    const [commentText, setCommentText] = useState("");
		const [postList, setPostList] = useState(null);

		// this ref is passed to a component called CreatePostPopup and that component
		// 	assign itself to this ref
		const createPostPopupRef = useRef(null);

    const handleScroll = (event) => {
        console.log("The window is scrolled");
    }

		useEffect(() => {
			axios.get("/api/posts")
				.then(res => {
					setPostList(res.data.jobs);
				})
				.catch(err => {
					console.log(err);
				})
		}, [0]);

		function clickOutsideCreatePostPopup(event){
			if(createPostPopupRef.current){
				if(!createPostPopupRef.current.contains(event.target)){
					// console.log("clicked outside create post popup");
					closeCreatePostPopup();
					document.removeEventListener("mousedown", clickOutsideCreatePostPopup);
				}
			}else{
				document.removeEventListener("mousedown", clickOutsideCreatePostPopup);
			}
		}

		function closeCreatePostPopup(){
			setCreatePostState(false);
		}

		function openCreatePostPopup(){
			setCreatePostState(true);
			
			document.addEventListener("mousedown", clickOutsideCreatePostPopup);
		}

    return (
        <div>
						{/* <Link to="/create-post" className="custom-nav-item">Create Post</Link> */}
						<button className="text-like-btn app-background app-text-color"
							onClick={openCreatePostPopup}>Create Post</button>
            <div className="post-list">
								{/* <Post/> */}
								{ postList && postList.map((post) => {
									return <Post key={post.id} post={post}/>
								}) }

								{ createPostState && <CreatePostPopup createPostPopupRef={createPostPopupRef}
									closeCreatePostPopup={closeCreatePostPopup}/> }
            </div>
        </div>
    );
}

export default Home;
