<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRegisterRequest extends FormRequest
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
            // ユーザのバリデーションチェック
            'name'                  => ['required', 'max:50', Rule::unique('users')->ignore($this->id, 'id')->where('delete_flg', '=', 0)],
            'prefecture'            => ['required'],
            'email'                 => ['required', 'email', 'max:100'],
            'birthday'              => ['required', 'date'],
            'password'              => ['required', 'min:6', 'confirmed'],
            'password_confirmation' => ['required', 'min:6'],
            'upload_image'          => 'image|mimes:jpeg,png,jpg,gif|max:1024|dimensions:max_width=250,ratio=1/1',
        ];
    }

    /**
     * メッセージをカスタマイズ
     */
    public function messages()
    {
        return [
            "mines"         => "指定された拡張子（PNG/JPG/GIF）ではありません。",
            "max"           => "１Ｍを超えています。",
            "dimensions"    => "画像の比率は1：1で横は最大250pxです。",
        ];
    }
}
