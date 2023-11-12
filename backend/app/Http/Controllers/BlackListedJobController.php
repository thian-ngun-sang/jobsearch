<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BlackListedJob;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreBlackListedJobRequest;
use App\Http\Requests\UpdateBlackListedJobRequest;

class BlackListedJobController extends Controller{

    public function index(){
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(){
        //
    }

    public function store(StoreBlackListedJobRequest $request){
        // logger($request->all());
        $jobId = $request->jobId;
        $user = Auth::user();
        
        if($jobId == null || $jobId == "" || $user == null || $user == ""){
            return response()->json(["msg" => "Bad request"], 400);
        }

        $blackListedJobRecord = BlackListedJob::where("user_id", $user->id)
            ->where("job_id", $jobId)
            ->first();
        if($blackListedJobRecord != null){
            return response()->json(["msg" => "Job already blacklisted"], 200);
        }

        $data = [
            "user_id" => $user->id,
            "job_id" => $jobId,
        ];

        $blackListedJob = BlackListedJob::create($data);
        // return response()->json(["msg" => "Success", "blackListedJob" => $blackListedJob]);
        return response()->json(["msg" => "Success", "blackListedJobId" => $blackListedJob->id]);
    }

    /**
     * Display the specified resource.
     */
    public function show(BlackListedJob $blackListedJob)
    {
        //
    }

    public function edit(BlackListedJob $blackListedJob)
    {
        //
    }

    public function update(UpdateBlackListedJobRequest $request, BlackListedJob $blackListedJob){
        //
    }

    public function destroy(BlackListedJob $blackListedJob){
        $deletedBlacklistedJob = $blackListedJob->delete();
        logger($deletedBlacklistedJob);

        return response()->json(["msg" => "Blacklisted job deleted"], 200);
    }
}
