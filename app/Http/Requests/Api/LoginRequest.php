<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoginRequest extends FormRequest
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
            'name'      => ['required', 'string', 'max:50'],
            'password'  => ['required', 'string', 'min:4'],
        ];
    }

    /**
     * バリデーション失敗時の処理をjson形式で返すためにオーバーライド
     */
    protected function failedValidation(Validator $validator) {
        // $res = response()->json();
        return new JsonResponse([
            'status' => 401,
            'errors' => $validator->errors(),
        ], 401);
    }

    /**
     * バリデーション後のチェック処理
     */
    // public function withValidator(Validator $validator) {
    //     $validator->after(function ($validator) {
    //         $user = \App\Model\User::where('name', $this->input('name'))->first();

    //         // 同名ユーザが存在して、ログイン中ユーザと同ユーザであればエラー
    //         if(null !== $user && $this->user()->id === $user->id){
    //             $validator->errors()->add('name', '既にログインしています。');
    //         }
    //     });
    // }
}
