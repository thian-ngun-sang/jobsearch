<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\LoginUserRequest;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\RegisterUserRequest;

class UserController extends Controller{
    
    public function store(RegisterUserRequest $request){
        $user = User::where('email', $request->email)->first();
        if($user){
            return ["msg" => "User with that email already exists"];
        }

        $user = User::where("user_name", $request->user_name)->first();
        if($user){
            return ["msg" => "User with that username already exists"];
        }

        return new UserResource(User::create($request->all()));
    }

    // validate user registration request(callback)
    public function validateRegData(Request $request){
        $validation = Validator::make($request->all(), [
            "user_name" => "required",
            "first_name" => "required",
            "last_name" => "required",
            "email" => "required",
            "password" => "required",
            "password2" => "required|same:password"
        ]);
        return $validation;
    }

    // register
    public function register(Request $request){
        $user = User::where('email', $request->email)->first();

        if($user){
            return response(["msg" => "User with that email already exists"], 400);
        }
        $user = User::where("user_name", $request->user_name)->first();
				if($user){

            return response(["msg" => "User with that username already exists"], 400);
        }

        $data = [
            'user_name' => $request->user_name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'password' => Hash::make($request->password)
        ];

        $validation = $this->validateRegData($request);
        if($validation->fails()){
            return ["err" => $validation];
        }

        // return new UserResource(User::create($request->all()));
        $token = User::create($data)->createToken('token');
        return ["token" => $token->plainTextToken];
    }

    // update
    public function update(Request $request, string $id){
        $user = User::where('id', $id)->first();
        if(!$request->first_name){
            return response()->json(['msg' => 'First name cannot be null'], 400);
        }
        if(!$request->user_name){
            return response()->json(['msg' => 'User name cannot be null'], 400);
        }
				if(!$request->email){
            return response()->json(['msg' => 'Email cannot be null'], 400);
        }

        $samerUsername = User::where('user_name', $request->user_name)->first();
        $sameEmail = User::where('email', $request->email)->first();
				if($samerUsername && $samerUsername->id != $user->id){
            return response()->json(['msg' => 'User with that username already exists'], 400);
        }
				if($sameEmail && $sameEmail->id != $user->id){

            return response()->json(['msg' => 'User with that email already exists'], 400);
        }
        
        $data = [
            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "user_name" => $request->user_name,
            "email" => $request->email,
            "phone" => $request->phone,
            "address" => $request->address
        ];

        $user->update($data);
        return response()->json(['msg' => "Profile update successfully", "user" => $user], 200);
    }

    // validate password
    public function validatePassword($request){
        $validation = Validator::make($request->all(), [
            "password" => "required",
            "password2" => "required",
            "password3" => "required|same:password2"
				],
				[
						"password3.same" => "The passwords are not match"
				]);
        return $validation;
    }

    // change password
    public function changePassword(Request $request){
        $user = Auth::user();
        // call back function
        $validation = $this->validatePassword($request);
				if($validation->fails()){
            return response()->json(["msg" => $validation->errors()->first()], 400);
        }

        if(!Hash::check($request->password, $user->password)){

            return response()->json(["msg" => "Credentials incorrect"], 400);
				}

				$data = ["password" => Hash::make($request->password2)];
				$user->update($data);
				return response()->json(["msg" => "Password changed success"], 200);
    }

    // login
    public function login(Request $request){
        $email = $request->email;
        $username = $request->user_name;
				$reqPassword = $request->password;

				logger($request->all());
				if($email == ""){
					return response()->json(["msg" => "Email cannot be null"], 400);
				}
				// if($username == ""){
				// 	return response()->json(["msg" => "Username cannot be null"], 400);
				// }
				if($reqPassword == ""){
					return response()->json(["msg" => "Password cannot be null"], 400);
				}

				if($email){
            $credentials = [
                "email" => $email,
                "password" => $reqPassword
						];
            
            if(!Auth::attempt($credentials)){
                return response()->json(["msg" => "Credentials incorrect"], 400);
            }

            $user = User::where('email', $request->email)->first();
            if($user){
                $basicToken = $user->createToken('basic-token');
                return response()->json(["token" => $basicToken->plainTextToken], 200);
            }
            return response()->json(["msg" => "There is no user with that email"], 400);
				}else if($username){
            $credentials = [
                "user_name" => $username,
                "password" => $reqPassword
            ];

            if(!Auth::attempt($credentials)){
                return response()->json(["msg" => "Credentials incorrect"], 400);
            }

            $user = User::where('user_name', $request->user_name)->first();
            if($user){
                $basicToken = $user->createToken('basic-token');
                return response()->json(["token" => $basicToken->plainTextToken], 200);
            }
            return response()->json(["msg" => "There is no user with that user_name"], 400);
        }
    }

    // account
    public function account(Request $request){
        $user = Auth::user();

        if($user){
            return ['user' => $user];
        }
        return ['msg' => 'Unauthenticated'];
    }

    // validate cover image
    public function validateCoverImage($request){
        $validation = Validator::make($request->all(), [
            "coverImage" => "required|mimes:png,jpeg,webp,svg"
        ]);
        return $validation;
    }

    // change cover image
    public function changeCoverImage(Request $request){
        $validation = $this->validateCoverImage($request);
        if($validation->fails()){
            return response()->json(["msg" => "Bad request"], 400);
        }
        $user = Auth::user();
        $filename = $request->coverImage->getClientOriginalName();
        $filename = uniqid() . preg_replace("/[^a-zA-Z0-9-_.]/", "", $filename);
        $data = [
            "cover_image" => $filename
        ];
        // logger(time());

        // logger($request->coverImage->getClientOriginalExtension());
        $request->coverImage->storeAs("public/user/coverImages/" . $user->id, $filename);
        $user->update($data);
        return ["msg" => "Success", "filename" => $filename];
    }

    // validate profile image
    public function validateProfileImage($request){
        $validation = Validator::make($request->all(), [
            "profileImage" => "required|mimes:png,jpeg,webp,svg"
        ]);
        return $validation;
    }

    // change profile image
    public function changeProfileImage(Request $request){
        $validation = $this->validateProfileImage($request);
        if($validation->fails()){
            return response()->json(["msg" => "Bad request"], 400);
        }

        $user = Auth::user();
        $filename = $request->profileImage->getClientOriginalName();
        $filename = uniqid() . preg_replace("/[^a-zA-Z0-9-_.]/", "", $filename);
        $data = [
            "profile_image" => $filename
        ];

        $request->profileImage->storeAs("public/user/profileImages/" . $user->id, $filename);
        $user->update($data);

        return ["msg" => "Success", "filename" => $filename];
    }
}
