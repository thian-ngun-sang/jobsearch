import { useState, useEffect, useReducer } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

import Job from "../components/Job";
import Filters from "../components/Filters";
import Popup from "../components/Popup";

const Jobs = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [removedJobs, setRemovedJobs] = useState([]);
    const [filterExcludeState, setFilterExcludeState] = useState(false);

    const searchParams = useSearchParams()[0];
    const location = useLocation();

    const initialJobs = {
        jobs: [],
        jobComponents: []
    }
    const jobReducer = (state, action) => {
        if(action.jobs && action.jobComponents){
            return {
                ...state,
                jobs: action.jobs,
                jobComponents: action.jobComponents
            };
        }
        return {
            ...state,
            [action.name]: action.value
        };
    }
    const [jobState, jobDispatch] = useReducer(jobReducer, initialJobs);

    const initSavedJob = {
        isVisible: false,
        message: ""
    }
    const savedJobReducer = (state, action) => {
        if(action.type === "ON"){
            return {
                isVisible: true,
                message: action.payload
            }
        }
        return {
            isVisible: false,
            message: ""
        };
    }
    const [savedJobState, savedJobDispatch] = useReducer(savedJobReducer, initSavedJob);

    // map and turn fetched or filtered jobs
    function mapJobs(jobs){
        let jobComponents = jobs.map((item, index) => {
            if(!removedJobs.includes(item.id)){
                return (
                    <div key={index}>
                        <Job job={item} removedJobs={removedJobs} setRemovedJobs={setRemovedJobs} initSavedJob={initSavedJob} savedJobDispatch={savedJobDispatch}/>
                        <hr/>
                    </div>
                );
            }else{
                return [];
            }
        })
        return jobComponents;
    }

    useEffect(() => {
        let jobUrl = "/api/jobs";

        if(location.pathname === "/jobs"){
            let query = "";
            const q = searchParams.get("q");
            if(q !== "" && q !== null){
                jobUrl += `?q=${q}`;
            }

            const experience = searchParams.get("experience");
            if(experience !== null && experience !== ""){
                query += "&experience=" + experience;
            }

            const type = searchParams.get("type");
            if(type !== null && type !== ""){
                query += "&type=" + type;
            }

            const location = searchParams.get("location");
            if(location !== null && location !== ""){
                query += "&location=" + location;
            }

            const education = searchParams.get("education");
            if(education !== null && education !== ""){
                query += "&education=" + education;
            }

            const requirements = searchParams.get("requirements");
            if(requirements !== null && requirements !== ""){
                query += "&requirements=" + requirements;
            }

            const skills = searchParams.get("skills");
            if(skills !== null && skills !== ""){
                query += "&skills=" + skills;
            }

            const minimumSalary = searchParams.get("minimumsalary");
            if(minimumSalary !== null && minimumSalary !== ""){
                query += "&minimumsalary=" + minimumSalary;
            }

            const paymentUnit = searchParams.get("paymentunit");
            if(paymentUnit !== null && paymentUnit !== ""){
                query += "&paymentunit=" + paymentUnit;
            }

            const paymentPeriod = searchParams.get("paymentperiod");
            if(paymentPeriod !== null && paymentPeriod !== ""){
                query += "&paymentperiod=" + paymentPeriod;
            }

            const exclude = searchParams.get("exclude");
            if(exclude !== null && exclude !== ""){
                query += "&exclude=" + exclude;
            }

            if(q !== null){
                jobUrl += query;
            }else if(query !== ""){
                query = query.slice(1);
                jobUrl += "?" + query;
            }
            // console.log(jobUrl);
            // jobUrl = `/api/jobs?q=${searchParams.get("q")}`;
        }

        axios.get(jobUrl)
            .then(res => {
                const jobs = res.data.jobs;
                const jobComponents = mapJobs(jobs);
                jobDispatch({jobComponents: jobComponents, jobs: jobs});
                setIsLoading(false);
                return res;
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err)
            })
    }, [searchParams]);

    useEffect(() => {
        const jobComponents = mapJobs(jobState.jobs);
        jobDispatch({name: "jobComponents", value: jobComponents});
    }, [removedJobs])

    function openFilter(){
        setFilterExcludeState(true);
    }

    function closeFilter(){
        setFilterExcludeState(false);
    }

    if(isLoading){
        return <div className="full-height"></div>
    }

    return (
        <div>
            {
            filterExcludeState &&
            <Filters jobsLength={jobState.jobs.length} closeFilter={closeFilter}/>    
            }

            <div className="jobs-banner app-background fixed-to-app-layout d-flex justify-content-between">
                <div className="my-2">
                    <Link to="/create-job" className="custom-nav-item">Create job</Link>
                </div>
                {
                    <div className="text-end my-2" onClick={openFilter}>
                        {
                            !filterExcludeState &&
                            <span className="custom-button cursor-pointer">
                                Filters
                            </span>
                        }
                    </div>
                }
            </div>

            <div className="jobs-content">
                { jobState.jobComponents }
            </div>

            <Popup myClass="info-popup fixed-to-app-layout d-flex justify-content-between" duration={3000} isVisible={savedJobState.isVisible} savedJobDispatch={savedJobDispatch}>
                <div>
                    <span>{ savedJobState.message }. </span>
                    <Link to="/saved-jobs">See Saved jobs</Link>
                </div>
            </Popup>
        </div>
    );
}

export default Jobs;
