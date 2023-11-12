import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";
import axios from "axios";

import { AuthContext } from "../auth_context";

const Job = ({job, removedJobs, setRemovedJobs, savedJobDispatch}) => {
    const authData = useContext(AuthContext);
    const { user, baseUrl } = authData;

    const [jobDropdownState, setJobDropdownState] = useState(false);
    const [blackListedJobState, setBlackListedJobState] = useState({
        state: false,
        blackListedJobId: 0
    });
    const jobDropdownRef = useRef(null);
    const jobToggleRef = useRef(null);

    const navigate = useNavigate();

    const clickOutsideJobDropdown = (event) => {
        // console.log(jobDropdownRef);
        if(jobDropdownRef.current && !jobDropdownRef.current.contains(event.target) &&
          jobToggleRef.current && !jobToggleRef.current.contains(event.target)){
            setJobDropdownState(false);
            document.removeEventListener("mousedown", clickOutsideJobDropdown);
        }
    }

    // toggle job dropdown
    const toggleJobDropdown = () => {
        setJobDropdownState(prev => !prev);
        document.addEventListener("mousedown", clickOutsideJobDropdown);
    }

    // remove job
    const removeJob = (jobId) => {
        if(!removedJobs.includes(jobId)){
            setRemovedJobs(prev => {
                return [...prev, jobId];
            })
        }
    }

    // save job
    const saveJob = () => {
        const jobId = job.id;
        const data = {
            jobId: jobId
        };

        if(Object.keys(user).length === 0){
            navigate("/login");
            return;
        }

        axios.post("/api/save-job/", data)
        .then(res => {
                const { msg } = res.data;
                if(msg !== null && msg !== undefined){
                    savedJobDispatch({ type: "ON", payload: msg });
                }
            })
            .catch(err => console.log(err))
        if(jobDropdownState){
            setJobDropdownState(false);
            document.removeEventListener("mousedown", clickOutsideJobDropdown)
        }
    }

    // blackList job
    const blackListJob = () => {
        const jobId = job.id;
        const data = {
            jobId: jobId
        };

        axios.post("/api/blacklist-job", data)
            .then(res => {
                const { blackListedJobId } = res.data;
                // console.log(res.data);
                if(blackListedJobId){
                    setBlackListedJobState({
                        state: true,
                        blackListedJobId: blackListedJobId
                    });
                }
            })
            .catch(err => console.log(err));
        
        if(jobDropdownState){
            setJobDropdownState(false);
            document.removeEventListener("mousedown", clickOutsideJobDropdown)
        }
    }

    const undoJobBlackList = () => {
        const { blackListedJobId } = blackListedJobState;
        if(blackListedJobId !== 0 && blackListedJobId !== null){
            axios.get(`/api/remove-blacklisted-job/${blackListedJobId}`)
                .then(res => console.log(res.data))
                .catch(err => console.log(err));
        }
        
        setBlackListedJobState({
            state: false,
            blackListedJobId: 0
        });
    }

    const timeAgo = (date) => {
        var ms = (new Date()).getTime() - date.getTime();
        var seconds = Math.floor(ms / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var months = Math.floor(days / 30);
        var years = Math.floor(months / 12);

        if (ms === 0) {
            return 'Just now';
        } if (seconds < 60) {
            return seconds + ' seconds ago';
        } if (minutes < 60) {
            return minutes + ' minutes ago';
        } if (hours < 24) {
            return hours + ' hours ago';
        } if (days < 30) {
            return days + ' days ago';
        } if (months < 12) {
            return months + ' months ago';
        } else {
            return years + ' years ago';
        }
    }

    let dateTime = job.created_at;
    let dateObject = new Date(dateTime);
    let timeResult = timeAgo(dateObject);

    let profileUrl;
    if(job.user_profile_image){
        profileUrl = baseUrl + "/storage/user/profileImages" + "/" + job.user_id + "/" + job.user_profile_image;
    }else{
        profileUrl = femaleDefaultProfile;
    }

    useEffect(() => {
        const handleScroll = () => {
            if(jobDropdownState) {
                setJobDropdownState(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [jobDropdownState]);

    // job dropdown template
    const jobDropdown = (<div className="job-dropdown app-background" ref={jobDropdownRef}>
        <ul className="custom-list">
            <li>
                <span className="custom-link cursor-pointer" onClick={blackListJob}>Never show me this job</span>
            </li>
            {/* <li>
                <span className="custom-link cursor-pointer">Report job</span>
            </li> */}
            <li>
                <span className="custom-link cursor-pointer" onClick={saveJob}>Save job</span>
            </li>
        </ul>
    </div>);

    return (
        blackListedJobState.state
        ? <>
            <div className="">
							You won't see this job in your results.  
							<span className="text-primary cursor-pointer ms-1" onClick={undoJobBlackList}>Undo</span>
	    			</div>
        </>
        :<>
            {/* job banner start */}
            <div className="d-flex justify-content-between mb-3 position-relative">
                <div className="d-flex">
                    <img className="jobs--user-profile--list-view" src={profileUrl} alt="profile"/>
                    <div className="ms-1 post-detail">
                        <span className="d-block">{ job.user_first_name } { job.user_last_name }</span>
                        <small>{ timeResult }</small>
                    </div>
                </div>
                <div className="user-select-none">
										<span className="cursor-pointer" onClick={toggleJobDropdown} ref={jobToggleRef}>
											<FontAwesomeIcon className="c-icon" icon={faEllipsis}/>
										</span>
			
										<span className="cursor-pointer c-ms-2" onClick={() => {removeJob(job.id)}}>
											<FontAwesomeIcon className="c-icon" icon={faXmark}/>
										</span>
										
                    <div>
                        { jobDropdownState && jobDropdown }
                    </div>
                </div>
            </div>
            {/* job banner end */}

            {/* job position */}
            <h5>{ job.position }</h5>

            {   job.description !== "" && job.description !== null &&
                <div>
                    <b>Description</b>:
                    <span> { job.description }</span>
                </div> }

            { job.experience !== "" &&
                <div>
                    <b>Experience</b>:
                    <span className="text-capitalize"> { job.experience }</span>
                </div> }

            {/* job type */}
            <div>
                <b>Type</b>:
                <span className="text-capitalize"> { job.type }</span>
            </div>
            
            { job.location !== null && job.location !== "" &&
                <div>
                    <b>Location</b>:
                    <span> { job.location }</span>
                </div> }

            { job.education_level !== null && job.education_level !== "" &&
                <div>
                    <b>Education</b>:
                    <span> { job.education_level }</span>
                </div> }

            { job.requirements !== null && job.requirements !== "" &&
                <div>
                    <b>Requirements</b>:
                    <span> { job.requirements }</span>
                </div> }
            
            { job.skills !== null && job.skills !== "" &&
                <div>
                    <b>Skills</b>:
                    <span> { job.skills }</span>
                </div> }

            { job.salary !== 0 &&
                <div>
                    <b>Slavery</b>:
                    <span> { job.salary }</span>
                    <span className="text-uppercase"> { job.payment_unit }</span>
                    <span className="">/{ job.payment_period }</span>
                </div> }
        </>
    )
}

export default Job;
