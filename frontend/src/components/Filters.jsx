import { useReducer } from "react";
import { useSearchParams } from "react-router-dom";

// import closeBtn from '../assets/icons/svgs/close-md.svg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Filters({jobsLength, closeFilter}) {
	const [searchParams, setSearchParams] = useSearchParams();

	const initialFilter = {
        experience: {
            internship: false,
            entry_level: false,
            junior: false,
            senior: false
        },
        type: {
            remote: false,
            on_site: false,
            hybrid: false,
            relocate: false
        },
        typeArray: [],
        location: "",
        locationArray: [],
        educationLevel: "",
        educationLevelArray: [],
        requirements: "",
        requirementsArray: [],
        skills: "",
        skillsArray: [],
        minimumSalary: 0,
        paymentUnit: "",
        paymentPeriod: ""
    };

	const filterReducer = (state, action) => {
        if(action.type === "checkbox"){
            // for example experience-internship
            if(/[a-z]--[a-z]/.test(action.name)){
                let fieldName = action.name;
                let [outterKey, innerkey] = fieldName.split("--");
                let oldState = state[outterKey];
                let newSate = {
                    ...oldState,
                    [innerkey]: action.value
                };
                // console.log(newSate);
                return {
                    ...state,
                    [outterKey]: newSate
                };
            }
        }
        if(action === "reset"){
            return initialFilter;
        }
        return {
            ...state,
            [action.name]: action.value
        }
		}
    const [state, dispatch] = useReducer(filterReducer, initialFilter);

		function handleFilter(event){
        let errorFlag = false;
        let target = event.target;
        let targetValue = target.value;
        let targetType = target.getAttribute("customtype");
        
        if(targetType === "number"){
            if(/[1-9]+[0-9]*/.test(targetValue)){
                targetValue = /[1-9]+[0-9]*/.exec(targetValue)[0];
                targetValue = parseInt(targetValue);
                errorFlag = false;
            }else if(/[0]+/.test(targetValue)){
                targetValue = "0";
                targetValue = parseInt(targetValue);
                errorFlag = false;
            }else if(targetValue === ""){
                targetValue = "0";
                targetValue = parseInt(targetValue);
                errorFlag = false;
            }else{
                errorFlag = true;
            }
        }

        if(target.type === "checkbox"){
            // console.log({type: "checkbox", name: target.name, value: target.checked});
            dispatch({type: "checkbox", name: target.name, value: target.checked});
        }else if(!errorFlag){
            dispatch({name: target.name, value: targetValue});
        }
    }

		// turn string into array
    function mapStringToList(str){
        let stringArray = str.split(",");
        let arrayResult = [];
        for(let i = 0; i < stringArray.length; i++){
            let stringVar = stringArray[i].trim().toLowerCase();
            arrayResult.push(stringVar);
        }
        return arrayResult;
    }

    // filter with (user passed) regular expression array
    /* function filterWithRegArray(regArray, arg){
        let resultArray = [];
        for(let i = 0; i < regArray.length; i++){
            let myReg = new RegExp(regArray[i], "i");
            resultArray.push(myReg.test(arg));
        }
        if(resultArray.includes(true)){
            return true;
        }
    } */

    function commitFilter(){
        let q = searchParams.get("q");

        if(q !== null){
            setSearchParams("q=" + q);
        }else{
            setSearchParams("");
        }

        let query = "";

        // if every experience is not false
        if(!(!state.experience.internship && !state.experience.entry_level && !state.experience.junior && !state.experience.senior)){
            let experienceArray = Object.keys(state.experience);
            experienceArray = experienceArray.filter(key => state.experience[key]);
            experienceArray = experienceArray.map(item => { // replace underscore ("_") with whitespace(" ")
                if(/[a-z]_[a-z]/.test(item)){
                    item = item.replace("_", " ");
                }
                return item;
            })
            
            // query = "&experience="+"junior";
            query += "&experience="+experienceArray.toString();
        }
        // if(state.type !== ""){
        if(!(!state.type.remote && !state.type.hybrid && !state.type.relocate && !state.type.on_site)){
            let typeArray = Object.keys(state.type);
            typeArray = typeArray.filter(key => state.type[key]);
            typeArray = typeArray.map(item => { // replace underscore ("_") with whitespace(" ")
                if(/[a-z]_[a-z]/.test(item)){
                    item = item.replace("_", " ");
                }
                return item;
            })

            query += "&type=" + typeArray.toString()
        }
        if(state.location !== ""){
            let locationArray = mapStringToList(state.location);

            query += "&location=" + locationArray.toString();
        }
        if(state.educationLevel !== ""){
            let educationLevelArray = mapStringToList(state.educationLevel);

            query += "&education=" + educationLevelArray.toString();
        }
        if(state.requirements !== ""){
            let requirementsArray = mapStringToList(state.requirements);

            query += "&requirements=" + requirementsArray.toString();
        }
        if(state.skills !== ""){
            let skillsArray = mapStringToList(state.skills);
            query += "&skills=" + skillsArray.toString();
        }
        if(state.minimumSalary !== 0){
            query += "&minimumsalary=" + state.minimumSalary.toString();
        }
        if(state.paymentUnit !== "anyunit" && state.paymentUnit !== ""){
            query += "&paymentunit=" + state.paymentUnit;
        }if(state.paymentPeriod !== "anyway" && state.paymentPeriod !== ""){
            query += "&paymentperiod=" + state.paymentPeriod;
        }

        if(q !== null && query !== ""){
            query = "q=" + q + query;
            setSearchParams(query);
        }else if (q !== null && query === ""){
            setSearchParams("q=" + q);
        }else if(query !== undefined && query !== ""){
            query = query.slice(1);
            setSearchParams(query);
        }else if(q === null && query === ""){
            setSearchParams("");
        }

    }

    function commitExcluder(){
        let q = searchParams.get("q");
        let query = "";

        // if every experience is not false
        if(!(!state.experience.internship && !state.experience.entry_level && !state.experience.junior && !state.experience.senior)){
            let experienceArray = Object.keys(state.experience);
            experienceArray = experienceArray.filter(key => state.experience[key]);
            experienceArray = experienceArray.map(item => { // replace underscore ("_") with whitespace(" ")
                if(/[a-z]_[a-z]/.test(item)){
                    item = item.replace("_", " ");
                }
                return item;
            })
            
            query += "&experience="+experienceArray.toString();
            
        }
        if(!(!state.type.remote && !state.type.hybrid && !state.type.relocate && !state.type.on_site)){
            let typeArray = Object.keys(state.type);
            typeArray = typeArray.filter(key => state.type[key]);
            typeArray = typeArray.map(item => { // replace underscore ("_") with whitespace(" ")
                if(/[a-z]_[a-z]/.test(item)){
                    item = item.replace("_", " ");
                }
                return item;
            })

            query += "&type=" + typeArray.toString()
        }
        if(state.location !== ""){
            let locationArray = mapStringToList(state.location);
            query += "&location=" + locationArray.toString();
        }
        if(state.educationLevel !== ""){
            let educationLevelArray = mapStringToList(state.educationLevel);
            query += "&education=" + educationLevelArray.toString();
        }
        if(state.requirements !== ""){
            let requirementsArray = mapStringToList(state.requirements);
            // filteredJobs = filteredJobs.filter(job => {
            //     // filterWithRegArray(<string-made-array>, <string-to-process>)
            //     return !filterWithRegArray(requirementsArray, job.requirements);
            // });

            query += "&requirements=" + requirementsArray.toString();
        }
        if(state.skills !== ""){
            let skillsArray = mapStringToList(state.skills);
            query += "&skills=" + skillsArray.toString();
        }
        if(state.minimumSalary !== 0){
            query += "&minimumsalary=" + state.minimumSalary.toString();
        }
        if(state.paymentUnit !== "anyunit" && state.paymentUnit !== ""){
            query += "&paymentunit=" + state.paymentUnit;
        }if(state.paymentPeriod !== "anyway" && state.paymentPeriod !== ""){
            query += "&paymentperiod=" + state.paymentPeriod;
        }

        query += "&exclude=true"
        if(q !== null && query !== ""){
            query = "q=" + q + query;
            setSearchParams(query);
        }else if (q !== null && query === ""){
            setSearchParams("q=" + q);
        }else if(query !== undefined && query !== ""){
            query = query.slice(1);
            setSearchParams(query);
        }else if(q === null && query === ""){
            setSearchParams("");
        }
    }

		function resetFilter(){
        dispatch("reset");
    }

  return (
					<div className="filter-exclude-ctn app-background">
                    <div className="position-relative">
                        <div className="filter-header app-background position-absolute">
                            <div className="text-end">
																{/* <img src={closeBtn} alt={closeBtn} className="custom-icon-lg" onClick={closeFilter}/> */}
																<span className="cursor-pointer" onClick={closeFilter}>
																	<FontAwesomeIcon className="c-icon" icon={faXmark}/>
																</span>
                            </div><hr className="filter-br"/>
                        </div>
                        <div className="filter-body">
                            <div className="filter-exclude-input mt-5">
                                <strong>Experience</strong>
                                <div className="filter-input-field">
                                    <div className="filter-checkbox-ctn">
                                        <div className="no-white-space">
                                            <input type="checkbox" id="internship" className="me-2" name="experience--internship" checked={state.experience.internship} onChange={handleFilter}/>
                                            <label value="internship" htmlFor="internship" className="cursor-pointer select-none">Internship</label>
                                        </div>
                                        <div className="second-filter-checkbox no-white-space">
                                            <input type="checkbox" id="entrylevel" className="me-2" name="experience--entry_level" checked={state.experience.entryLevel} onChange={handleFilter}/>
                                            <label value="entry level" htmlFor="entrylevel" className="cursor-pointer select-none">Entry Level</label>
                                        </div>
                                    </div>
                                    <div className="filter-checkbox-ctn">
                                        <div className="no-white-space">
                                            <input type="checkbox" id="junior" className="me-2" name="experience--junior" checked={state.experience.junior} onChange={handleFilter}/>
                                            <label value="junior" htmlFor="junior" className="cursor-pointer select-none">Junior</label>
                                        </div>
                                        <div className="second-filter-checkbox no-white-space">
                                            <input type="checkbox" id="senior" className="me-2" name="experience--senior" checked={state.experience.senior} onChange={handleFilter}/>
                                            <label value="senior" htmlFor="senior" className="cursor-pointer select-none">Senior</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="filter-exclude-input">
                                <strong>Type</strong>
                                {/* <div className="filter-input-field">
                                    <input type="text" className="filter-input-double filter-input" name="type" value={state.type} onChange={handleFilter} placeholder="Remote, Hybrid"/>
                                </div> */}
                                <div className="filter-input-field">
                                    <div className="filter-checkbox-ctn">
                                        <div className="no-white-space">
                                            <input type="checkbox" id="remote" className="me-2" name="type--remote" checked={state.type.remote} onChange={handleFilter}/>
                                            <label htmlFor="remote" className="cursor-pointer select-none">Remote</label>
                                        </div>
                                        <div className="second-filter-checkbox no-white-space">
                                            <input type="checkbox" id="on-site" className="me-2" name="type--on_site" checked={state.type.onsite} onChange={handleFilter}/>
                                            <label htmlFor="on-site" className="cursor-pointer select-none">On site</label>
                                        </div>
                                    </div>
                                    <div className="filter-checkbox-ctn">
                                        <div className="no-white-space">
                                            <input type="checkbox" id="hybrid" className="me-2" name="type--hybrid" checked={state.type.hybrid} onChange={handleFilter}/>
                                            <label htmlFor="hybrid" className="cursor-pointer select-none">Hybrid</label>
                                        </div>
                                        <div className="second-filter-checkbox no-white-space">
                                            <input type="checkbox" id="relocate" className="me-2" name="type--relocate" checked={state.type.relocate} onChange={handleFilter}/>
                                            <label htmlFor="relocate" className="cursor-pointer select-none">Relocate</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="filter-exclude-input">
                                <strong>Location</strong>
                                <div className="filter-input-field">
                                    <input type="text" className="filter-input-double filter-input" name="location" value={state.location} onChange={handleFilter} placeholder="United Kingdom"/>
                                </div>
                            </div>
                            <div className="filter-exclude-input">
                                <strong>Education</strong>
                                <div className="filter-input-field">
                                    <input type="text" className="filter-input-double filter-input" name="educationLevel" value={state.educationLevel} onChange={handleFilter} placeholder="Bachelor, Master, Grade 10"/>
                                </div>
                            </div>
                            <div className="filter-exclude-input">
                                <strong>Requirements</strong>
                                <div className="filter-input-field">
                                    <input type="text" className="filter-input-double filter-input" name="requirements" value={state.requirements} onChange={handleFilter} placeholder="Good at communication, Must be able to"/>
                                </div>
                            </div>
                            <div className="filter-exclude-input">
                                <strong>Skills</strong>
                                <div className="filter-input-field">
                                    <input type="text" className="filter-input-double filter-input" name="skills" value={state.skills} onChange={handleFilter} placeholder="HTML, CSS, English"/>
                                </div>
                            </div>
                            <div className="filter-exclude-input mb-5">
                                <strong>Minimum Salary</strong>
                                <div className="filter-input-field">
                                    <div className="">
                                        <div className="d-flex">
                                            <strong className="d-flex salary-filter-label">Amount</strong>
                                            <input type="text" className="cms-3 filter-input filter-input-sm" customtype="number" name="minimumSalary" value={state.minimumSalary} onChange={handleFilter}/>
                                        </div>
                                        <div className="d-flex">
                                            <strong className="d-block salary-filter-label">Unit</strong>
                                            <select className="cms-3 filter-input filter-input-sm" name="paymentUnit" value={state.paymentUnit} onChange={handleFilter}>
                                                <option value="anyunit">any</option>
                                                <option value="usd">usd</option>
                                                <option value="mmk">mmk</option>
                                            </select>
                                        </div>

                                        <div className="d-flex">
                                            <strong className="d-block salary-filter-label">Per</strong>
                                            <select className="cms-3 filter-input filter-input-sm" name="paymentPeriod" value={state.paymentPeriod} onChange={handleFilter}>
                                                <option value="anyway">any</option>
                                                <option value="hour">hour</option>
                                                <option value="week">week</option>
                                                <option value="month">month</option>
                                                <option value="year">year</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="filter-footer position-absolute app-background">
                            <hr className="filter-br"/>
                            <div className="d-flex justify-content-between">
                                <div className="ms-3">
                                    <span>
                                        { jobsLength } jobs
                                    </span>
                                </div>
                                <div className="text-end mb-2">
                                    <span className="cursor-pointer" onClick={resetFilter}>Reset | </span>
                                    <span className="cursor-pointer" onClick={commitFilter}>Filter | </span>
                                    <span className="cursor-pointer" onClick={commitExcluder}>Exclude</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
  )
}

export default Filters;
