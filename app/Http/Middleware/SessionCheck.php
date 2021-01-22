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
        if(Auth::user()) {
            return $next($request);
        }
        return response()->json([
            'error_message' => 'セッションが切れました。再度ログインしてください',
            'status'        => -1,
        ], 500, [], JSON_UNESCAPED_UNICODE);
    }
}
