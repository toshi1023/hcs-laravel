<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\User;
use App\Prefecture;
use App\Http\Controllers\Auth\File;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');

    }

    public function showRegistrationForm()
    {
      // 都道府県データを会員登録フォームに渡す
      $prefectures = Prefecture::all();



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

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        // ファイルの拡張子を取得
        $file_dot = File::extension('app/'. $data->file('prof_photo'));

        // 画像をprofile_imagesフォルダに保存する処理
        $path = "app/". $data->prof_photo->storeAs('public/profile_images', Auth::id() . $file_dot);

        return User::create([
             // データベース保存用の名前を抽出
            'prof_photo' => basename($path),
            'name' => $data['name'],
            'nickname' => $data['nickname'],
            'prefecture' => $data['prefecture'],
            'birthday' => $data['birthday'],
            'gender' => $data['gender'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
}
