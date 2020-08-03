<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
// バリデーションの拡張機能を追加
use Illuminate\Validation\Rule;

class PostUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'prof_photo' => ['file', 'image','max:2048'],
            'name' => ['required', 'string', 'max:255'],
            // ニックネームはusersテーブルで一意な必要がある
            'nickname' => ['required', 'string', 'max:20'],
            Rule::unique('users', 'nickname')->ignore($request->id),
            'prefecture' => ['required', 'string'],
            'birthday' => ['required', 'date'],
            'gender' => ['required', 'integer'],
            'email' => ['required', 'string', 'email', 'max:255'],
            Rule::unique('users', 'email')->ignore($request->id),
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}
