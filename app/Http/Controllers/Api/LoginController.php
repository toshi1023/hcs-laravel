<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Exception;

class LoginController extends Controller
{
    /**
     * Api通信でのログイン処理を実行
     */
    public function login(Request $request)
    {

        $credentials = $request->only('name', 'password');

        // Sessionにパスワードがセットされている場合
        if (session()->has('password')) {
            $credentials['password'] = session()->get('password');
        }
        
        // 認証成功時はtokenを返す
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('Laravel Password Grant Client')->accessToken;

            // セッションからパスワードを削除する
            if (session()->has('password')) {
                session()->forget('password');
            }

            return new JsonResponse([
                'token' => $token, 
                'id' => $user->id, 
                'login_user_photo' => $user->users_photo_path,
                'info_message' => 'ログインに成功しました'
            ], 200);
        }
        return new JsonResponse([
            'error_message' => 'IDもしくはパスワードが正しくありません',
            'status'        => 401,
        ], 401);
       
    }

    /**
     * Api通信でのログアウト処理を実行
     */
    public function logout(Request $request)
    {
        try {
            // Tokenの削除
            if (Auth::check()) {
                Auth::user()->AauthAcessToken()->delete();
                Auth::logout();
            }
            return new JsonResponse([
                'info_message' => 'ログアウトしました'
            ], 200);
        } catch(Exception $e) {
            \Log::error('Logout Error:'.$e->getMessage());
            return new JsonResponse([
                'error_message' => 'ログアウトに失敗しました',
                'status'        => 401,
            ], 401);
        }
    }
}
