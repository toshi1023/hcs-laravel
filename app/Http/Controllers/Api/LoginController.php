<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Api\LoginRequest;

class LoginController extends Controller
{
    /**
     * Api通信でのログイン処理を実行
     */
    public function login(LoginRequest $request)
    {

        $credentials = $request->only('name', 'password');
        
        // 認証成功時はtokenを返す
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('Laravel Password Grant Client')->accessToken;
            return new JsonResponse([
                'token' => $token, 
                'id' => $user->id, 
                'login_user_photo' => $user->users_photo_path,
                'info_message' => 'ログインに成功しました!'
            ], 200);
            // return new JsonResponse([
            //     'token' => $token, 
            //     'id' => $user->id, 
            //     'login_user_photo' => $user->users_photo_path
            // ], 200);
        }
        return new JsonResponse([
            'error_message' => 'IDもしくはパスワードが正しくありません',
            'status'        => 401,
        ], 401);
        // return new JsonResponse([
        //     'error_message' => 'IDもしくはパスワードが間違っています'
        // ], 401);

    }
}
