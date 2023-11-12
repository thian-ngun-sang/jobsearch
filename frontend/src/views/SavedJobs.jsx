import { useState, useEffect, useReducer } from "react";
import axios from "axios";

import SavedJob from "../components/SavedJob";
import Popup from "../components/Popup";

function SavedJobs(){
    // map and turn fetched or filtered jobs
    function mapJobs(jobs){
        let jobComponents = jobs.map((item, index) => {
            if(!removedJobs.includes(item.saved_job_id)){
                return (
                    <div key={index}>
                        <SavedJob job={item} removedJobs={removedJobs} setRemovedJobs={setRemovedJobs} savedJobDispatch={savedJobDispatch}/>
                        <hr/>
                    </div>
                );
            }else{
                return [];
            }
        })
        return jobComponents;
    }

    function fetchJobs(){
        axios.get("/api/saved-jobs")
            .then(res => {
                const { jobs } = res.data;
                const jobComponents = mapJobs(jobs);
                jobDispatch({jobComponents: jobComponents, jobs: jobs});
                return jobs;
            })
            .catch(err => console.log(err));
    }

    const [removedJobs, setRemovedJobs] = useState([]);

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

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        const jobComponents = mapJobs(jobState.jobs);
        jobDispatch({name: "jobComponents", value: jobComponents});
    }, [removedJobs])

    return (
        <div>
            <div>
                { jobState.jobComponents }
            </div>

            <Popup myClass="info-popup fixed-to-app-layout d-flex justify-content-between" duration={2500} isVisible={savedJobState.isVisible} savedJobDispatch={savedJobDispatch}>
                <div>
                    { savedJobState.message }
                </div>
            </Popup>
        </div>
    );
}

export default SavedJobs;
