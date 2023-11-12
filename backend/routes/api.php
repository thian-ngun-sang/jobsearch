<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'auth:sanctum', 'namespace' => 'App\Http\Controllers'], function(){
    // jobs
    // job list
    Route::get('/jobs', ['uses' => 'JobController@index']);
    
    // Route::apiResource('/jobs', JobController::class);
    // create job
    Route::post('/jobs/create', ['uses' => 'JobController@store']);

    // saved jobs
    // created saved-job
    Route::post('/save-job', ['uses' => 'SavedJobController@store']);
    // show list of saved-job
    Route::get('/saved-jobs', ['uses' => 'SavedJobController@index']);
    // remove saved-job
    Route::post('/remove-saved-job/{savedJob}', ['uses' => 'SavedJobController@destroy']);

    // blacklisted jobs
    // create job blacklist
    Route::post('/blacklist-job', ['uses' => 'BlackListedJobController@store']);
    // remove blacklisted-job
    Route::get('/remove-blacklisted-job/{blackListedJob}', ['uses' => 'BlackListedJobController@destroy']);

    // account
    Route::get('/account', ['uses' => 'UserController@account']);
    // update profile
    Route::post('/account/update/{id}', ['uses' => 'UserController@update']);
    // change password
    Route::patch('/account/change-password', ['uses' => 'UserController@changePassword']);
    // change cover image
    Route::post('/account/change-cover-image', ['uses' => 'UserController@changeCoverImage']);
    // change profile image
    Route::post('/account/change-profile-image', ['uses' => 'UserController@changeProfileImage']);
});

Route::group(['namespace' => 'App\Http\Controllers'], function(){
    // register
    // Route::apiResource('user', UserController::class);
    Route::post('user/register', ['uses' => 'UserController@register']);

    // login
    // Route::post('user/login', [UserController::class, 'login']);
    Route::post('user/login', ['uses' => 'UserController@login']);

    // dashboard
    Route::get('/', function(Request $request){
        return response()->json(["request" => "Hello this is dashboard"]);
    });
});
