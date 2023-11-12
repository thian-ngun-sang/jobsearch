<?php

namespace App\Http\Controllers;

use App\Models\Job;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\StoreJobRequest;
use App\Http\Requests\UpdateJobRequest;

class JobController extends Controller
{

    private function filterJobs($request, $jobsParam){
        $localJobs = $jobsParam;
        $experience = request()->experience;
        if(isset($experience)){
            $experienceArray = explode(',', $experience);
            $localJobs = $localJobs->whereIn("jobs.experience", $experienceArray);
        }

        $type = $request->query("type");
        if(isset($type)){
            $typeArray = explode(',', $type);
            $localJobs = $localJobs->whereIn("jobs.type", $typeArray);
        }

        $location = $request->query("location");
        if(isset($location)){
            $locationArray = explode(',', $location);
            $localJobs = $localJobs->where(function ($query) use ($locationArray){
                foreach($locationArray as $currentLocation){
                    $query->orWhere("jobs.location", "like", "%".$currentLocation."%");
                }
            });
        }

        $education = $request->query("education");
        if(isset($education)){
            $educationArray = explode(',', $education);

            $localJobs = $localJobs->where(function ($query) use ($educationArray){
                foreach($educationArray as $currentEducation){
                    $query->orWhere("jobs.education_level", "like", "%".$currentEducation."%");
                }
            });
        }

        $requirements = $request->query("requirements");
        if(isset($requirements)){
            $requirementsArray = explode(',', $requirements);

            $localJobs = $localJobs->where(function ($query) use ($requirementsArray){
                foreach($requirementsArray as $currentRequirement){
                    $query->orWhere("jobs.requirements", "like", "%".$currentRequirement."%");
                }
            });
        }

        $skills = $request->query("skills");
        if(isset($skills)){
            $skillsArray = explode(',', $skills);
            $localJobs = $localJobs->where(function($query) use ($skillsArray){
                foreach($skillsArray as $skill){
                    $query->orWhere("jobs.skills", "like", "%".$skill."%");
                }
            });
        }

        $minimumSalary = $request->query("minimumsalary");
        if(isset($minimumSalary)){
            $localJobs = $localJobs->where("jobs.salary", ">", $minimumSalary);
        }

        $paymentUnit = $request->query("paymentunit");
        if(isset($paymentUnit)){
            $localJobs = $localJobs->where("jobs.payment_unit", $paymentUnit);
        }

        $paymentPeriod = $request->query("paymentperiod");
        if(isset($paymentPeriod)){
            $localJobs = $localJobs->where("jobs.payment_period", $paymentPeriod);
        }

        return $localJobs;
    }

    private function excludeJobs($request, $jobsParam){
        $localJobs = $jobsParam;
        $experience = request()->experience;
        if(isset($experience)){
            $experienceArray = explode(',', $experience);
            $localJobs = $localJobs->whereNotIn("jobs.experience", $experienceArray);
        }

        $type = $request->query("type");
        if(isset($type)){
            $typeArray = explode(',', $type);
            $localJobs = $localJobs->whereNotIn("jobs.type", $typeArray);
        }

        $location = $request->query("location");
        if(isset($location)){
            $locationArray = explode(',', $location);
            $localJobs = $localJobs->where(function ($query) use ($locationArray){
                foreach($locationArray as $currentLocation){
                    $query->where("jobs.location", "not like", "%".$currentLocation."%");
                }
            });
        }

        $education = $request->query("education");
        if(isset($education)){
            $educationArray = explode(',', $education);

            $localJobs = $localJobs->where(function ($query) use ($educationArray){
                foreach($educationArray as $currentEducation){
                    $query->where("jobs.education_level", "not like", "%".$currentEducation."%");
                }
            });
        }

        $requirements = $request->query("requirements");
        if(isset($requirements)){
            $requirementsArray = explode(',', $requirements);

            $localJobs = $localJobs->where(function ($query) use ($requirementsArray){
                foreach($requirementsArray as $currentRequirement){
                    $query->where("jobs.requirements", "not like", "%".$currentRequirement."%");
                }
            });
        }

        $skills = $request->query("skills");
        if(isset($skills)){
            $skillsArray = explode(',', $skills);
            $localJobs = $localJobs->where(function($query) use ($skillsArray){
                foreach($skillsArray as $skill){
                    $query->where("jobs.skills", "not like", "%".$skill."%");
                }
            });
        }

        $minimumSalary = $request->query("minimumsalary");
        if(isset($minimumSalary)){
            $localJobs = $localJobs->where("jobs.salary", "<", $minimumSalary);
        }

        $paymentUnit = $request->query("paymentunit");
        if(isset($paymentUnit)){
            $localJobs = $localJobs->where("jobs.payment_unit", $paymentUnit);
        }

        $paymentPeriod = $request->query("paymentperiod");
        if(isset($paymentPeriod)){
            $localJobs = $localJobs->where("jobs.payment_period", $paymentPeriod);
        }

        return $localJobs;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request){
        $jobs = [];
        
        if(Auth::user()){
            $q = $request->query("q");

            if($request->q){
                $jobs = Job::select('jobs.*', 'users.first_name as user_first_name', 'users.last_name as user_last_name', 'users.profile_image as user_profile_image')
                        ->leftJoin("users", "jobs.user_id", "users.id")
                        ->whereNotIn("jobs.id", function($query){
                            $query->select("job_id")
                                ->from("black_listed_jobs")
                                ->where("user_id",  Auth::user()->id);
                        })
                        ->where('position', 'like', '%' . $request->q . '%');
                        // ->get();
            }else{
                $jobs = Job::select('jobs.*', 'users.first_name as user_first_name', 'users.last_name as user_last_name', 'users.profile_image as user_profile_image')
                    ->leftJoin("users", "jobs.user_id", "users.id")
                    ->whereNotIn("jobs.id", function($query){
                        $query->select("job_id")
                            ->from("black_listed_jobs")
                            ->where("user_id",  Auth::user()->id);
                    });
                    // ->get();
            }

            $exclude = $request->exclude;
            if(isset($exclude) && $exclude == true){
                $jobs = $this->excludeJobs($request, $jobs);
            }else{
                $jobs = $this->filterJobs($request, $jobs);
            }
            
            $jobs = $jobs->get();
        }

        return ["jobs" => $jobs];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobRequest $request){
        // logger($request->experience["unit"]);
        $userId = Auth::user()->id;
        $data = [
            "user_id" => $userId,
            "position" => $request->position,
            "description" => $request->description,
            // "experience_number" => $request->experience["number"],
            // "experience_unit" => $request->experience["unit"],
            "experience" => $request->experience,
            "type" => $request->type,
            "location" => $request->location,
            "education_level" => $request->education,
            "requirements" => $request->requirements,
            "skills" => $request->skills,
            "salary" => $request->salary["amount"],
            "payment_unit" => $request->salary["unit"],
            "payment_period" => $request->salary["period"]
        ];
        Job::create($data);
        return ["msg" => "Success"];
    }

    /**
     * Display the specified resource.
     */
    public function show(Job $job)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Job $job)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobRequest $request, Job $job)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Job $job)
    {
        //
    }
}
