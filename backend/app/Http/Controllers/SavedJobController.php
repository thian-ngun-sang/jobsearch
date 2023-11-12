<?php

namespace App\Http\Controllers;

use App\Models\SavedJob;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Http\Requests\StoreSavedJobRequest;
use App\Http\Requests\UpdateSavedJobRequest;

class SavedJobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(){
        $userId = Auth::user()->id;
        $savedJobs = SavedJob::select("saved_jobs.id as saved_job_id", "saved_jobs.user_id as saved_job_user_id", "jobs.*",
                DB::raw("(SELECT profile_image from users where jobs.user_id = users.id) as user_profile_image"),
                DB::raw("(SELECT first_name from users where jobs.user_id = users.id) as user_first_name"),
                DB::raw("(SELECT last_name from users where jobs.user_id = users.id) as user_last_name"),
                )
            ->leftJoin("jobs", "saved_jobs.job_id", "jobs.id")
            ->where("saved_jobs.user_id", $userId)
            ->get();
        
        return response()->json(["msg" => "Success", "jobs" => $savedJobs], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(){
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSavedJobRequest $request){
        $jobId = $request->jobId;
        $user = Auth::user();
        
        if($jobId == null || $jobId == "" || $user == null || $user == ""){
            return response()->json(["msg" => "Bad request"], 400);
        }

        $savedJobRecord = SavedJob::where("user_id", $user->id)
            ->where("job_id", $jobId)
            ->first();
        if($savedJobRecord != null){
            // logger("Job already saved");
            return response()->json(["msg" => "Job already saved"], 200);
        }

        $data = [
            "user_id" => $user->id,
            "job_id" => $jobId,
        ];
        $savedJob = SavedJob::create($data);
        return response()->json(["msg" => "Job saved", "data" => $savedJob], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(SavedJob $savedJob)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SavedJob $savedJob)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSavedJobRequest $request, SavedJob $savedJob)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SavedJob $savedJob){
        $savedJob->delete();

        return response()->json(["msg" => "Saved job removed", "savedJob" => $savedJob], 200);
    }
}

// use Illuminate\Http\Response;
// response()->json([...])
// ->setStatusCode(Response::HTTP_OK, Response::$statusTexts[Response::HTTP_OK]);