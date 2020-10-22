<?php

namespace App\Http\Middleware;

use Closure;

class ArrangeDataFilter
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
        // 送信データにmapが存在する場合
        if($request->map) {
            // 緯度・経度を分割
            $map = explode(',', $request->map);

            // 緯度・経度を配列に追加
            $request['latitude'] = $map[0];
            $request['longitude'] = $map[1];
        }

        return $next($request);
    }
}