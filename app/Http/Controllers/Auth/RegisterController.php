<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Model\User;
use App\Model\Prefecture;
use App\Service\UserService;

use App\Http\Controllers\Auth\File;
use Illuminate\Support\Facades\Auth;
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
        /*
        (ローカルに保存する場合)
        画像名をランダムに作成
        $filename = md5(uniqid(rand(), true));

        作成したファイル名にアップロードした画像の拡張子を連結
        $filename .= "." . substr(strrchr($_FILES['prof_photo']['name'], '.'), 1);

        画像を保存するユーザごとのフォルダを作成し、変数に代入
        $folder = $data->id;

        画像を保存するフォルダを設定
        $path = "profile_images/". $foler;

        画像がアップロードに成功していたら画像を指定フォルダに保存
        if($data->file('prof_photo')->isValid([])){

           // $data->file('prof_photo')->storeAs($path, $filename, 'public');

           return redirect()->to('/')->with('message', 'プロフィール画像付きのユーザを登録しました。');

        } else {

          return redirect()->to('/')->with('error', 'イメージ画像の登録に失敗しました。');
        }
        */

        $image = null;
        $filename = null;

        if ($_FILES['prof_photo']['name']){
          // ファイル名を変数に代入
          $filename = $_FILES['prof_photo']['name'];
          // 画像データを変数に代入
          $image = $data['prof_photo'];
        }
        
        DB::beginTransaction();
        if ($this->database->save($data, $filename, $image)){

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
