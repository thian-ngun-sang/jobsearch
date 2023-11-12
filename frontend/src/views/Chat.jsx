import ChatItem from "../components/ChatItem";
import StoryItem from "../components/StoryItem";

// import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";
import moreAlignIcon from "../assets/icons/svgs/align-justify-more.svg";

function Chat(){
    return (
        <div>
            <div className="chat-navbar">
                <div className="d-flex">
                    <img className="custom-icon-xl" src={moreAlignIcon} alt={moreAlignIcon}/>
                    <h4 className="ms-3">Chats</h4>
                </div>
            </div>

            <div>
                <ul className="user-list mt-3 d-flex">
                    <StoryItem/>
                    <StoryItem/>
                    <StoryItem/>
                    <StoryItem/>
                </ul>
            </div>

            <div>
                <ul className="user-list mt-3">
                    <ChatItem/>
                    <ChatItem/>
                    <ChatItem/>
                    <ChatItem/>
                </ul>
            </div>
        </div>
    );
}

export default Chat;