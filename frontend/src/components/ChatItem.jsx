import { Link } from "react-router-dom";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";

function ChatItem(){
    return (
        <li>
            <div className="d-flex my-3 mx-2">
                <img className="chat-user-item" alt="female default" src={femaleDefaultProfile}/>
                <Link to="/chat/1" className="text-decoration-none text-dark">
                    <div className="ms-2">
                        <small className="d-block">Na Na</small>
                        <small className="d-block">Hello</small>
                    </div>
                </Link>
            </div>
        </li>            
    );
}

export default ChatItem;
