<?php

namespace App\Http\Controllers\Web\Auth;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Web\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * ログインページのルート指定をオーバーライド
     */
    public function showLoginForm()
    {
      return view('auth.login');
    }

    /**
     * ログイン処理で使用されるguardメソッドの引数をオーバーライド
     */
    protected function guard(){
      return Auth::guard('user');
    }

    public function username()
    {
      return 'nickname';
    }

}
