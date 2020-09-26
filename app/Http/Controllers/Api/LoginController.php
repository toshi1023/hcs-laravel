<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Api通信でのログイン処理を実行
     */
    public function login(Request $request)
    {
        // Auth::guard('api')->login();

        // $credentials = $request->only('email', 'password');

        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $accessToken = Auth::user()->createToken('authToken')->accessToken;
            return response(['user' => Auth::user(), 'token' => $accessToken]);
        }

        return response([
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
