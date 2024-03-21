<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller{
     // Display a listing of the resource.
    public function index(){
			$posts = Post::select('posts.*', 'users.first_name as user_first_name', 'users.last_name as user_last_name', 'users.profile_image as user_profile_image')
				->leftJoin("users", "posts.user_id", "users.id")
				->get();

				if($posts){
					$posts = $posts->toArray();
				}

        return response()->json(["jobs" => $posts], 200);
    }

    // Show the form for creating a new resource.
    public function create(){
			//
    }

	 	// Store a newly created resource in storage.
    // public function store(StorePostRequest $request){
    public function store(Request $request){
			$userId = Auth::user()->id;

			// Validate the incoming request
			$request->validate([
					'files.*' => 'required|mimes:jpg,jpeg,png,pdf|max:2048', // Adjust file types and size as needed
			]);

			$data = [
				"user_id" => $userId,
				"body" => $request->body
			];

			if($request->file('files')){
				// Process and save each uploaded file
				$uploadedFiles = [];
				foreach ($request->file('files') as $file) {
						$filename = uniqid() . '_' . $file->getClientOriginalName();// Generate a unique filename
						// $file->storeAs('public/uploads/posts', $filename, 'public');// Store the file in the public disk
						$file->storeAs('public/uploads/posts', $filename);// Store the file in the public disk

						// Save file information or perform any other actions as needed
						// $uploadedFiles[] = [
						// 		'filename' => $filename,
						// 		'original_name' => $file->getClientOriginalName(),
						// 		'path' => 'uploads/' . $filename, // Adjust the path based on your storage configuration
						// ];
						$uploadedFiles[] = $filename;
				}
				$data["files"] = $uploadedFiles;
			}
			
			// $jsonData = $request->getContent();// Retrieve JSON data from the request
			// $dataArray = json_decode($jsonData, true);// Decode JSON data to an associative array

			Post::create($data);
			return response()->json(["msg" => "post created"], 200);
    }

    // Display the specified resource.
    public function show(Request $request, $id){
				$post = Post::where('id', $id)->get();
				if($post){
					$post = $post->toArray();
				}

        return response()->json(["post" => $post], 200);
    }
		
		// Show the form for editing the specified resource.
    public function edit(Post $post){
        //
    }

    // Update the specified resource in storage.
    public function update(UpdatePostRequest $request, $id){
				$post = Post::where('id', $id)->first();
				if(is_null($post)){
						return response()->json(["msg" => "Post not found"], 404);
				}
				
				$data = [
					"body" => $request->body	
				];
				$post->update($data);

				return response()->json(["msg" => "Post updated success", "post" => $post], 200);
    }

    // Remove the specified resource from storage.
    public function destroy(Request $request, $id){
				$post = Post::where('id', $id)->first();
				if(is_null($post)){
					return response()->json(["msg" => "Post not found"], 404);
				}

				$post->delete();
				$post = $post->toArray();
				return response()->json(["msg" => "Job deleted success", "post" => $post], 200);
    }
}
