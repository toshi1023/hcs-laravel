<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class LoginController extends Controller
{
    /**
     * Api通信でのログイン処理を実行
     */
    public function login(Request $request)
    {
        // Auth::guard('api')->login();

        // $credentials = $request->only('email', 'password');

        // if(Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
        //     $accessToken = Auth::user()->createToken('authToken')->accessToken;
        //     return response(['user' => Auth::user(), 'token' => $accessToken]);
        // }

        // return response([
        //     'message' => 'Unauthenticated.'
        // ], 401);

        $credentials = $request->only('email', 'password');

        // 認証成功時はtokenを返す
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('Laravel Password Grant Client')->accessToken;
            return new JsonResponse(['token' => $token], 200);
        }

        // 認証失敗時はエラーメッセージを返す
        return new JsonResponse([
            'message' => 'Unauthenticated.'
        ], 401);
    }

    /**
     * Api通信でのログアウト処理を実行
     */
    public function logout(Request $request)
    {
        Auth::guard('api')->logout();

        return ;
    }
}
