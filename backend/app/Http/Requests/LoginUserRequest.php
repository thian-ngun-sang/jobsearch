<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $email = $this->input('email');
				$user_name = $this->input('user_name');

        if($email == ""){
            return [
                "email" => ["required", "email"],
                "password" => ["required"]
            ];
        }else if($user_name == ""){
            return [
                "user_name" => ["required"],
                "password" => ["required"]
            ];
				}        
		}

		public function messages(){
			return [
				"email.required"  => "Email cannot be null",
				"password.required" => "Password cannot be null",
				"user_name.required" => "Username cannot be null"
			];
		}
}
