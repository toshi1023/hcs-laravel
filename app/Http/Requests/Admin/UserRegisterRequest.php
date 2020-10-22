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
        if(request()->register_mode == 'edit' && request()->password == null && request()->password_confirmation == null) {
            return [
                // ユーザのバリデーションチェック
                'name'                  => ['required', 'max:50', Rule::unique('users')->ignore($this->id, 'id')->where('delete_flg', '=', 0)],
                'prefecture'            => ['required'],
                'email'                 => ['required', 'email', 'max:100', 'regex:/^[a-zA-Z0-9\.\-@]+$/'],
                'birthday'              => ['required', 'date'],
                'upload_image'          => 'image|mimes:jpeg,png,jpg,gif|max:1024',
            ];
        }
        return [
            // ユーザのバリデーションチェック
            'name'                  => ['required', 'max:50', Rule::unique('users')->ignore($this->id, 'id')->where('delete_flg', '=', 0)],
            'prefecture'            => ['required'],
            'email'                 => ['required', 'email', 'max:100', 'regex:/^[a-zA-Z0-9\.\-@]+$/'],
            'birthday'              => ['required', 'date'],
            'password'              => ['required', 'min:6', 'confirmed', 'regex:/^[0-9a-zA-Z\_@!?#%&]+$/'],
            'password_confirmation' => ['required', 'min:6', 'regex:/^[0-9a-zA-Z\_@!?#%&]+$/'],
            'upload_image'          => 'image|mimes:jpeg,png,jpg,gif|max:1024',
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
            'email.regex'    => '@以前は半角英数字で入力してください',
            'password.regex'    => 'パスワードは半角英数字及び「_@!?#%&」の記号のみで入力してください',
            'password_confirmation.regex'    => 'パスワード（確認）は半角英数字及び「_@!?#%&」の記号のみで入力してください',
        ];
    }
}
