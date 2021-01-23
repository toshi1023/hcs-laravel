<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class SessionCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // ログインユーザの確認
        if(Auth::user()) {
            // 次の処理を実行
            return $next($request);
        }
        // ログインユーザが見つからない場合
        return response()->json([
            'error_message' => 'セッションが切れました。再度ログインしてください',
            'status'        => -1,
        ], 500, [], JSON_UNESCAPED_UNICODE);
    }
}
