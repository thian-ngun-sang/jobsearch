import React, { useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Popup({ children, myClass, duration, isVisible, savedJobDispatch }){

    useEffect(() => {

        const timer = setTimeout(() => {
            if(isVisible){
                savedJobDispatch({ type: "OFF" });
            }
        }, duration)

        return () => {
            clearTimeout(timer);
        }
    }, [isVisible]);

    return isVisible ? (
        <div className={myClass}>
            <span>
                { children }
            </span>
            <span>
								<span className="cursor-pointer" onClick={ () => savedJobDispatch({ type: "OFF" }) }>
									<FontAwesomeIcon className="c-icon" icon={faXmark}/>
								</span>
            </span>
        </div>
    )
    :null;
    
}

export default Popup;
