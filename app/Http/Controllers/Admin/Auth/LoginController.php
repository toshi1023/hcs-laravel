<?php

namespace App\Http\Controllers\Admin\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Session;
use Carbon\Carbon;

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
    protected function guard()
    {
      return Auth::guard('admin');
    }

    /**
     * ログイン処理（削除フラグを見る）
     * @return \Illuminate\Http\RedirectResponse
     */
    public function attemptLogin(Request $request) 
    {
      // ステータス「管理者(システムアドミン)」
      if ($this->customAttempt($request)) {
          return true;
      }
      return false;
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

    /**
     * カスタム認証
     * @param Request $request
     * @return bool
     * attempt()メソッドにより、キーに指定した値を自動的にDBから取得する
     * input()メソッドにより入力値のJSON情報にアクセス
     */
    private function customAttempt(Request $request) 
    {
      if ($this->guard()->attempt(
          [
              'email' => $request->input('email'),
              'password' => $request->input('password'),
              'delete_flg' => 0
          ], $request->filled('remember'))
      ) {
          // 管理権限があるかどうかチェック
          if ($this->guard()->user()->isAdmin()) {
              // ログイン日時セット
              $this->guard()->user()->login_time = Carbon::now();
              $this->guard()->user()->save();
              return true;
          } else {
              // 権限無しはログアウト処理
              Session::put('admins', 'ログインの権限がありません');
              $this->guard()->logout();
          }
      }
      return false;
  }
}
