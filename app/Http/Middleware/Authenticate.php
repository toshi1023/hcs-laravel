<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // dd($request->header());
        if (! $request->expectsJson()) {
            // prefixにhcs-admin/が付いていれば、管理画面側のログインページに飛ばす
            if($request->is('hcs-admin/*')) return route('hcs-admin.login');

            // prefixに何も無ければ、フロント側のログインページに飛ばす
            return route('login');
        }
    }
}
