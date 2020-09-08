<?php

namespace App\Http\Controllers\Admin\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::ADMIN_HOME;

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
      // dd(\Session::get('admins'));
      return view('admin.auth.login');
    }

    /**
     * ログイン処理で使用されるguardメソッドの引数をオーバーライド
     */
    protected function guard(){
      return Auth::guard('admin');
    }

    /**
     * ログアウト処理の実行
     */
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();

        return $this->loggedOut($request);
    }

    /**
     * ログアウト後のリダイレクト先を設定
     */
    protected function loggedOut(Request $request)
    {
      return redirect(route('hcs-admin.login'));
    }

}
