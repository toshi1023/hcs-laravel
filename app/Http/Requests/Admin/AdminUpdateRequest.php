<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdateRequest extends FormRequest
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
            // Adminユーザの更新時バリデーションチェック
            'email' => ['required', 'email', 'max:100', Rule::unique('admins')->ignore($this->id, 'id')->where('delete_flg', '=', 0)],
        ];
    }
}
