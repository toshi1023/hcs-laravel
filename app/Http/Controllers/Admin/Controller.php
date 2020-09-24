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

    // パスワードをバリデート
    public function passwordValidation(Request $request)
    {
        $request->validate([
            'password' => ['required', 'min:6', 'confirmed'],
            'password_confirmation' => ['required', 'min:6'],
        ]);
    }

    // 経度・緯度をバリデート
    public function mapValidation(Request $request)
    {
        $request->validate([
            'latitude' => ['numeric'],
            'longitude' => ['numeric'],
        ]);
    }
}
