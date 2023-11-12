
import Post from "../components/Post";
import CommentPopup from "../components/CommentPopup";
import { useState } from "react";

/*
import img2 from "../assets/images/posts/background06.jpg";
import img3 from "../assets/images/posts/berlin_city_sunset.jpg";
import img4 from "../assets/images/posts/cherry_blossoms.jpg";
import img5 from "../assets/images/posts/kruger_national_park.webp";
*/

function Home(){
    const [commentFormState, setCommentFormState] = useState(true);
    // const [popupBlock, setPopupBlock] = useState(false);
    const [commentText, setCommentText] = useState("");

    const handleScroll = (event) => {
        console.log(event);
        console.log("The window is scrolled");
    }

    return (
        <div>
            <div className="post-list">
                <Post/>
                <Post/>
                <Post/>
                <Post/>
            </div>
        </div>
    );
}

export default Home;
