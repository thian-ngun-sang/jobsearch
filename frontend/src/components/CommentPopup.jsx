const CommentPopup = ({commentText, setCommentText, setCommentFormState}) => {
    const handleComment = (event) => {
        // console.log(event.target.value);
        setCommentText(event.target.value);
    }

    // top most
        // screenX 669
        // screenY 163

    // bottom
        // screenX 711
        // screenY 183
    const handleScroll = (event) => {
        // console.log("screenX " + event.screenX, "screenY " + event.screenY);
        // if(event.deltaY >= 15 || event.deltaY <= -20){
        //     setCommentFormState(false);
        // }

        // deltaX: 0
        // deltaY: 3.1092529296875
        //
        // deltaX: 0
        // deltaY: 49.594645182291664

        // deltaX: 0
        // deltaY: -3.08319091796875
        //
        // deltaX: 0
        // deltaY: -1.58575439453125

        console.log(event);
    }

    return (
        <div className="comment-popup" onWheel={handleScroll}>
            <div className="comment-list">
                <p className="comment">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni laudantium aliquam magnam, ab adipisci corporis voluptatum reprehenderit eius repudiandae, aut laboriosam animi at placeat quae ipsam atque eum distinctio in!
                </p>
            </div>
            <div className="d-flex comment-form mt-2">
                <textarea className="comment-textarea bg-white" onKeyUp={handleComment} placeholder="What's on your opion"></textarea>
                <div className="ms-2">
                    <button>Comment</button>
                </div>
            </div>
        </div>
    );
}

export default CommentPopup;
