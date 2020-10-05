<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\MessageBag;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $messages;

    public function __construct()
    {
        // セッションに保存するメッセージ用メソッドをインスタンス化
        $this->messages = new MessageBag();
    }

    /**
     * ファイル名の設定
     * 引数：ファイル情報
     */
    public function getFilename($file)
    {
        $tmp_name   = md5(microtime());                    // ファイル名取得(microtime() : Unixタイムスタンプ)
        $ext        = $file->getClientOriginalExtension(); // 拡張子GET
        $image_name = $tmp_name.".".$ext;

        return $image_name;
    }

    
    /**
     * パスワードのバリデーションメソッド
     * 引数：保存するデータ
     */
    public function passwordValidation($request)
    {
        $request->validate([
            'password' => ['required', 'min:6', 'confirmed'],
            'password_confirmation' => ['required', 'min:6'],
        ]);
    }

    /**
     * 経度・緯度のバリデーションメソッド
     * 引数：保存するデータ
     */
    public function mapValidation($request)
    {
        $request->validate([
            'latitude' => ['numeric'],
            'longitude' => ['numeric'],
        ]);
    }
}
