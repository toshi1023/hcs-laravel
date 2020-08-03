<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Model\User;
use App\Model\Prefecture;
use App\Service\UserService;

use App\Http\Controllers\Auth\File;
use Illuminate\Support\Facades\Auth;
// バリデーションの拡張機能を追加
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
     // 登録完了後はTOPページにリダイレクト
    protected $redirectTo = '/';

    protected $UserService;

    protected $database;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(UserService $database)
    {
      $this->middleware('guest');

      // DB操作のクラスをインスタンス化
      $this->database = $database;
    }

    public function showRegistrationForm()
    {
      // 都道府県データを会員登録フォームに渡す
      $prefectures = $this->database->getCreate('prefectures')->get();

      return view('auth.register', [
          'prefectures' => $prefectures,
      ]);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'prof_photo' => ['file', 'image','max:2048'],
            'name' => ['required', 'string', 'max:255'],
            // ニックネームはusersテーブルで一意な必要がある
            'nickname' => ['required', 'string', 'max:20', 'unique:users'],
            'prefecture' => ['required', 'string'],
            'birthday' => ['required', 'date'],
            'gender' => ['required', 'integer'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ],[],[
          'prof_photo' => 'プロフィール画像',
          'name' => '氏名',
          'nickname' => 'ニックネーム',
          'prefecture' => '都道府県',
          'birthday' => '生年月日',
          'gender' => '性別',
          'email' => 'メールアドレス',
          'password' => 'パスワード',
        ]);
    }

    /* ユーザ保存メソッド */
    public function store(PostUserRequest $request)
    {
      $image = null;
      $filename = null;

      if ($_FILES['prof_photo']['name']){
        // ファイル名を変数に代入
        $filename = $_FILES['prof_photo']['name'];
        // 画像データを変数に代入
        $image = $request['prof_photo'];
      }
      
      DB::beginTransaction();
      if ($this->database->save($request, $filename, $image)){

        DB::commit();
      
      } else {

        DB::rollBack();
      }
    }

    public function redirectPatch() 
    {
        return redirect()->to('/')->with('message', 'ユーザを登録しました。');
    } 
}
