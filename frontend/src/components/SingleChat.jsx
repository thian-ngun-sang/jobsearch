import { useNavigate } from "react-router-dom";
import femaleUserImg from "../assets/images/defaults/female_user.jpg";

import backIcon from "../assets/icons/svgs/back.svg";
import phoneIcon from "../assets/icons/svgs/camera-plus.svg";

function SingleChat(){
    const navigate = useNavigate();

    const stepBack = () => {
        navigate(-1);
    }

    return (
        <div>
            <img src={backIcon} onClick={stepBack} className="custom-icon-xl" alt="back-icon"/>
            <div className="d-flex justify-content-between mt-1">
                <div className="d-flex align-items-center">
                    <img src={femaleUserImg} className="chat-user-item mx-2"/>
                    <div className="ms-2">Dawt</div>
                </div>
                <div>
                    <img src={phoneIcon} className="custom-icon-lg mx-1"/>
                    <img src={phoneIcon} className="custom-icon-lg mx-1"/>
                    <img src={phoneIcon} className="custom-icon-lg mx-1"/>
                </div>
            </div>
            <div>
                <div className="text-end">
                    <span className="bg-primary text-item">
                        Ziang tuah
                    </span>
                </div>
                <div className="d-flex align-items-center">
                    <img src={femaleUserImg} className="chat-user-item-xsm"/>
                    <span className="ms-1 bg-secondary text-item">
                        Ziang hman
                    </span>
                </div>
                <div className="text-end">
                    <span className="bg-primary text-item">
                        Aw
                    </span>
                </div>
            </div>
        </div>
    );
}

export default SingleChat;
