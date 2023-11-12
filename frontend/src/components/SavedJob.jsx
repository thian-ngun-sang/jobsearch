import { useState, useEffect, useRef, useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";

// import closeMd from "../assets/icons/svgs/close-md.svg";
// import moreHorizontal from "../assets/icons/svgs/more-horizontal.svg";

import { AuthContext } from "../auth_context";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";
import axios from "axios";


const SavedJob = ({job, removedJobs, setRemovedJobs, savedJobDispatch}) => {
		const authData = useContext(AuthContext);
		const { baseUrl } = authData;

    const [jobDropdownState, setJobDropdownState] = useState(false);
    const jobDropdownRef = useRef(null);
    const jobToggleRef = useRef(null);

    // toggle job dropdown
    const toggleJobDropdown = () => {
        setJobDropdownState(prev => !prev);
        document.addEventListener("mousedown", clickOutsideJobDropdown);
    }

    const clickOutsideJobDropdown = (event) => {
        // console.log(jobDropdownRef);
        if(jobDropdownRef.current && !jobDropdownRef.current.contains(event.target) &&
          jobToggleRef.current && !jobToggleRef.current.contains(event.target)){
            setJobDropdownState(false);
            document.removeEventListener("mousedown", clickOutsideJobDropdown);
        }
    }

    // remove job
    const removeJob = (jobId) => {
        if(!removedJobs.includes(jobId)){
            setRemovedJobs(prev => {
                return [...prev, jobId];
            })
        }
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

    function removeSavedJob(savedJobId){
        removeJob(savedJobId);
        savedJobDispatch({ type: "ON", payload: "Saved job has been removed" });
        axios.post(`/api/remove-saved-job/${savedJobId}`)
            .then(res => {
                const { msg } = res.data;

                console.log(msg);
            })
            .catch(err => console.log(err))
    }

    function handleWheel(){
        // console.log("Handle Wheel");
        setJobDropdownState(false);
    }

    let dateTime = job.created_at;
    let dateObject = new Date(dateTime);
    let timeResult = timeAgo(dateObject);

    let profileUrl;
    const profileImageBaseUrl = `${baseUrl}/storage/user/profileImages`;
    if(job.user_profile_image){
        profileUrl = profileImageBaseUrl + "/" + job.user_id + "/" + job.user_profile_image;
    }else{
        profileUrl = femaleDefaultProfile;
    }

    useEffect(() => {
        const handleScroll = () => {
            if (jobDropdownState) {
                setJobDropdownState(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            console.log("Saved dropdown removed");
            window.removeEventListener('scroll', handleScroll);
        };
    }, [jobDropdownState]);

    // job dropdown template
    const jobDropdown = (<div className="job-dropdown" ref={jobDropdownRef}>
        <ul className="custom-list">
            <li>
                <span className="custom-link cursor-pointer" onClick={() => removeSavedJob(job.saved_job_id)}>Remove from saved jobs</span>
            </li>
        </ul>
    </div>)

    return (
        <>
            {/* job banner start */}
            <div className="d-flex justify-content-between mb-3 position-relative" onScroll={handleWheel}>
                <div className="d-flex">
                    <img className="jobs--user-profile--list-view" src={profileUrl} alt={profileUrl}/>
                    <div className="ms-1 post-detail">
                        <span className="d-block">{ job.user_first_name } { job.user_last_name }</span>
                        <small>{ timeResult }</small>
                    </div>
                </div>
                <div className="user-select-none">
								{/* <img src={moreHorizontal} alt={moreHorizontal} className="custom-icon-lg" ref={jobToggleRef} onClick={toggleJobDropdown}/>
															<img src={closeMd} alt={closeMd} className="ms-1 custom-icon-lg" onClick={() => {removeJob(job.saved_job_id)}}/> */}
										<span className="cursor-pointer" onClick={toggleJobDropdown} ref={jobToggleRef}>
											<FontAwesomeIcon className="c-icon" icon={faEllipsis}/>
										</span>
										<span className="cursor-pointer c-ms-2" onClick={() => {removeJob(job.saved_job_id)}}>
											<FontAwesomeIcon className="c-icon" icon={faXmark}/>
										</span>

                    <div>
                        { jobDropdownState && jobDropdown }
                    </div>
                </div>
            </div>

            {/* job position */}
            <h5>{ job.position }</h5>
            { job.description !== "" && job.description !== null &&
                <div>
                    <b>Description</b>:
                    <span> { job.description }</span>
                </div> }

            { job.experience !== "" &&
                <div>
                    <b>Experience</b>:
                    <span className="text-capitalize"> { job.experience }</span>
                </div>
            }

            {/* Type */}
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

export default SavedJob;
