<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use App\Service\Admin\UserService;

class AdminController extends Controller
{

    protected $database;
    protected $service;

    public function __construct(UserService $database)
    {
      Parent::__construct();
      
      // DB操作のクラスをインスタンス化
      $this->database = $database;
    }

    public function index()
    {
      // 全ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex('users')->get();

      return view('Admin.users.index',[ 'users' => $users ]);

    }

    public function create()
    {
      // 都道府県データを会員登録フォームに渡す
      $prefectures = $this->database->getCreate('prefectures')->get();

      return view('Admin.users.create', [
          'prefectures' => $prefectures,
      ]);
    }

    /* ユーザ保存メソッド */
    public function store(Request $request)
    {
      $filename = null;

      if ($_FILES['prof_photo']['name']){
        // ファイル名を変数に代入
        $filename = $_FILES['prof_photo']['name'];
      }
      
      DB::beginTransaction();
      if ($this->database->userSave($request, $filename)){
        DB::commit();
        return redirect()->route('home')->with('message', 'ユーザ登録に成功しました。ログインページからログインしてください');
      } else {
        DB::rollBack();
        $this->messages->add('', 'ユーザ登録に失敗しました。管理者に問い合わせてください');
        return redirect()->route('home')->withErrors($this->messages);
      }
    }

    public function pdf()
    {
      echo "test";
      // 全ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex()->get();
      $pdf = \PDF::loadView('/layouts/pdf_template');

      // ブラウザ上で開く
      return $pdf->inline('thisis.pdf');

      // ダウンロードする場合
      // return $pdf->download('download.pdf');
    }

    public function show($user)
    {
      $user = $this->database->getShow($user);

      return view('users.show', [
        'user' => $user,
      ]);
    }

    public function edit($user)
    {
      $data = $this->database->getEdit($user);

      return view('users.edit', [
        'user' => $data['user'],
        'prefectures' => $data['prefectures'],
      ]);
    }

    public function update(Request $request, $user)
    {
      $user = $this->database->getEdit($user)['user'];
      
      $filename = null;

      if ($_FILES['prof_photo']['name']){
        // ファイル名を変数に代入
        $filename = $_FILES['prof_photo']['name'];
      }

      DB::beginTransaction();

      if ($this->database->userSave($request, $filename, $user)) {
        DB::commit();
        return redirect()->route('users.show', ['user' => $user])->with('message', 'プロフィールの変更を保存しました');
      } else {
        DB::rollBack();
        $this->messages->add('', 'プロフィールの変更に失敗しました。管理者に問い合わせてください');
        
        return redirect()->route('users.edit', ['user' => $user])->withErrors($this->messages);
      }
    }
}
