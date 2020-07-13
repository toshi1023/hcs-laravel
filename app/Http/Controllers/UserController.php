<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Model\User;
use App\Model\Prefecture;
use App\Service\UserService;

class UserController extends Controller
{

    protected $database;

    public function __construct(UserService $database)
    {
      // DB操作のクラスをインスタンス化
      $this->database = $database;
    }

    public function index()
    {
      // 全ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex()->get();

      return view('users.index',[ 'users' => $users ]);

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

    public function show(User $user)
    {
      return view('users.show', [
        'user' => $user,
      ]);
    }

    public function edit(User $user)
    {
      $user = User::find($user->id);

      $prefectures = Prefecture::all();

      return view('users.edit', [
        'user' => $user,
        'prefectures' => $prefectures,
      ]);
    }

    public function update(Request $request, User $user)
    {
      $user = User::find($user->id);

      // 修正内容の代入
      $user->name = $request->name;
      $user->nickname = $request->nickname;
      $user->prefecture = $request->prefecture;
      $user->birthday = $request->birthday;
      $user->gender = $request->gender;
      $user->email = $request->email;
      $user->password = Hash::make($request->password);

      $user->save();

      return redirect('users/'.$user->id);
    }
}
