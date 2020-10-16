<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ArticleRegisterRequest extends FormRequest
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
            // 記事のバリデーションチェック
            'prefecture'            => 'required',
            'map'                   => ['required'], // 緯度・経度チェック
            'title'                 => ['required', 'max:50'],
            'content'               => ['required', 'max:1000'],
            'upload_image'          => 'image|mimes:jpeg,png,jpg,gif|max:1024',
            // 'map'                   => ['required', 'numeric'],
            'map'                   => ['required'],
        ];
    }

    /**
     * メッセージをカスタマイズ
     */
    public function messages()
    {
        return [
            "mines"             => "指定された拡張子（PNG/JPG/GIF）ではありません。",
            "max"               => "１Ｍを超えています。",
            // "regex:/\A[-]?[0-9]{1,3}\.[0-9]{1,6}\z/u"     => '緯度・経度の入力形式が正しくありません',
            'map.required'      => '緯度経度は必須です。',
            // 'map.numeric'       => '緯度経度は数字で入力してください。',
        ];
    }
}
