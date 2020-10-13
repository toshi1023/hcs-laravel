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
            return new JsonResponse(['token' => $token, 'id' => $user->id], 200);
        }

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
