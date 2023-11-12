import axios from "axios";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// import backIcon from "../assets/icons/svgs/back.svg";
// import { useLocation } from "react-router-dom";

function CreateJob(){
    const [formStep, setFormStep] = useState(1);
    const [formState, setFormState] = useState({
        isActivated1: false,
        error: false
    });
    const [form, setForm] = useState({
        position: "",
        description: "",
        // experience: {
        //     number: 0,
        //     unit: "month"
        // },
        experience: "internship",
        type: "remote",
        location: "",
        education: "",
        requirements: "",
        skills: "",
        salary: {
            amount: 0,
            unit: "usd",
            period: "hour"
        }
    });
    const navigate = useNavigate();

    function handleForm(event){
        let errorFlag = false;
        let element = event.target;
        let name = element.name;
        let type = element.getAttribute("customtype");
        var value = element.value;

        if(type === "number"){
            // extract number if starts with zero
            const extractNumberReg = /[1-9]+[0-9]*/;
            if(extractNumberReg.test(value)){
                value = extractNumberReg.exec(value)[0];
                value = parseInt(value);
                errorFlag = false;
            }else if(/[0]+/.test(value)){
                value = "0";
                value = parseInt(value);
                errorFlag = false;
            }else if(value === ""){
                value = "0";
                value = parseInt(value);
                errorFlag = false;
            }else{
                errorFlag = true;
            }
        }

        if(!errorFlag){
            const reg = /[a-z]+-[a-z]+/;    // experience-number
            if(reg.test(name)){
                let [outterKey, innerKey] = name.split("-");
                let stateCopy = form[outterKey];

                setForm(prev => {
                    return {
                        ...prev,
                        [outterKey]: {
                            ...stateCopy,
                            [innerKey]: value
                        }
                    }
                })
            }else{
                setForm(prev => {
                    return {
                        ...prev,
                        [event.target.name]: value
                    }
                })
            }
        }
    }

    function nextStep(){
        if(form.position === ""){
            setFormState(prev => {
                return {
                    ...prev,
                    isActivated1: true
                };
            })
        }else{
            setFormStep(2);
        }
    }

    function prevStep(){
        setFormStep(1);
    }

    const stepBack = () => {
        navigate(-1);
    }

    function submitForm(){
        let formError = false;
        
        if(form.position === ""){
            formError = true;
        }

        if(!formError){
            console.log(form);
            axios.post("/api/jobs/create", form)
            .then(res => {
                navigate("/jobs");
                console.log(res.data)
            })
            .catch(err => console.log(err))
        }
    }

    return (
        <div>
            <div className="mt-2">
								{/* <img className="custom-icon-xl" alt={backIcon} src={backIcon} onClick={stepBack}/> */}
								<FontAwesomeIcon className="c-icon cursor-pointer" onClick={stepBack} icon={faArrowLeft} />
            </div>
            <div>
                <div className="text-center w-75">
                    <h3>Post Job</h3>
                </div>
                {
                    formStep === 2 &&
                    <div className="text-start w-75">
												{/* <img className="custom-icon-xl" alt={backIcon} src={backIcon} onClick={prevStep}/> */}
												<FontAwesomeIcon className="c-icon cursor-pointer" onClick={prevStep} icon={faArrowLeft} />
                    </div>
                }
                <form>
                    { formStep === 1 &&
                    <div>
                        <div className="custom-input-container">
                            <label>Position</label>
                            <input className={formState.isActivated1 && form.position === "" ?
                                "custom-input w-75 invalid-custom-input" : "custom-input w-75"}
                                type="text" name="position" value={form.position} onChange={handleForm}
                                placeholder="Frontend developer"/>
                            { formState.isActivated1 && form.position === "" && <small className="text-danger">This field cannot be null</small> }
                        </div>
                        <div className="custom-input-container">
                            <label>Description</label>
                            <textarea className="custom-input w-75" name="description" value={form.description} onChange={handleForm} placeholder="We are looking for ..."></textarea>
                        </div>
                        <div className="custom-input-container">
                            <label>Experience</label>
                            <div>
                                <select className="custom-input mt-1 w-75" name="experience" value={form.experience} onChange={handleForm}>
                                    <option value="internship">Internship</option>
                                    <option value="entry level">Entry Level</option>
                                    <option value="junior">Junior</option>
                                    <option value="senior">Senior</option>
                                </select>
                            </div>
                        </div>
                        <div className="custom-input-container my-1">
                            <label>Type</label>
                            <select className="custom-input mt-1 w-75" name="type" value={form.type} onChange={handleForm}>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="on site">On site</option>
                            </select>
                        </div>
                        <div className="custom-input-container">
                            <label>Location</label>
                            <input type="text" className="custom-input w-75" name="location" value={form.location} onChange={handleForm} placeholder="United States"/>
                        </div>
                        <div className="custom-input-container">
                            <label>Education</label><br/>
                            <input type="text" className="custom-input w-75" name="education" value={form.education} onChange={handleForm} placeholder="Bachelor"/>
                        </div>
                    </div>
                    }
                    { formStep === 2 &&
                    <div>
                        <div className="custom-input-container my-1">
                            <label>Requirements</label><br/>
                            <textarea className="w-75" onChange={handleForm} name="requirements" value={form.requirements}></textarea>
                        </div>
                        <div className="custom-input-container my-1">
                            <label>Skills</label><br/>
                            <textarea className="w-75" onChange={handleForm} name="skills" value={form.skills}></textarea>
                        </div>
                        <div className="custom-input-container my-1">
                            <label>Salary</label><br/>
                            <div className="">
                                {/* <input type="number" className="col-5" min="0" name="salary-amount" value={form.salary.amount} onChange={handleForm} onKeyUp={handleKeyUp}/> */}
                                <input customtype="number" className="col-5" min="0" name="salary-amount" value={form.salary.amount} onChange={handleForm}/>
                                <select className="col-2 mx-1" name="salary-unit" value={form.salary.unit} onChange={handleForm}>
                                    <option value="usd">Dollar</option>
                                    <option value="rupee">Rupee</option>
                                    <option value="mmk">Kyats</option>
                                </select>
                                <select className="col-2" name="salary-period" value={form.salary.period} onChange={handleForm}>
                                    <option value="hour">Per Hour</option>
                                    <option value="minute">Per Week</option>
                                    <option value="month">Per Month</option>
                                    <option value="year">Per Year</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    }
                </form>
                {
                    formStep === 1 &&
                    <div className="text-end w-75">
                        <button className="btn btn-sm btn-secondary" onClick={nextStep}>Next</button>
                    </div>
                }
                {
                    formStep === 2 &&
                    <div className="text-end w-75 mt-2 ms-3">
                        <button className="btn btn-sm btn-secondary" onClick={submitForm}>Create Job</button>
                    </div>
                }
            </div>
        </div>
    );
}

export default CreateJob;
