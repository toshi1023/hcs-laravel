<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Service\Web\UserService;

class UserController extends Controller
{

    protected $database;
    protected $service;

    public function __construct(UserService $database)
    {
      Parent::__construct();
      
      // DB操作のクラスをインスタンス化
      $this->database = $database;
    }

    public function index(Request $request)
    {
      /// 検索条件のセット
      $conditions = [];
      if ($request->input('query')) { $conditions['users.name@like'] = $request->input('query'); }

      // 全ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex(null, $conditions);
      // dd($users);
      return response()->json([
        'users' => $users, 
      ],200, [], JSON_UNESCAPED_UNICODE);

      // 認証失敗時はエラーメッセージを返す
      return new JsonResponse([
        'message' => 'Unauthenticated.'
      ], 401);

    }

    public function create()
    {
      // 都道府県データを会員登録フォームに渡す
      $prefectures = $this->database->getCreate('prefectures')->get();

      return view('users.create', [
          'prefectures' => $prefectures,
      ]);
    }

    /* ユーザ保存メソッド */
    public function store(Request $request)
    {
      // DB::beginTransaction();

      $filename = null;

      // // // パスワードのハッシュ処理
      // $request['password'] = Hash::make($request['password']);

      // if ($request->file('upload_image')){
      //   $filename = $this->getFilename($request->file('upload_image'));
      // }
      
      // if ($this->database->save($request, $filename)){
      //   DB::commit();
      //   return response()->json([
      //     'messages' => 'Success!', 
      //   ],200, [], JSON_UNESCAPED_UNICODE);
      // } else {
      //   DB::rollBack();
      //   // 作成失敗時はエラーメッセージを返す
      //   return new JsonResponse([
      //     'message' => 'Create Failed'
      //   ], 401);
      // }
      $data = $this->database->save($request, $filename);
      return new JsonResponse([
        'request' => $data['name']
      ], 401);
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

    public function show($api_user)
    {
      $user = $this->database->getShow($api_user);

      return response()->json([
        'user' => $user, 
      ],200, [], JSON_UNESCAPED_UNICODE);
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

      DB::beginTransaction();

      if ($this->database->userSave($request, null, $user)) {
        DB::commit();
        return redirect()->route('users.show', ['user' => $user])->with('message', 'プロフィールの変更を保存しました');
      } else {
        DB::rollBack();
        $this->messages->add('', 'プロフィールの変更に失敗しました。管理者に問い合わせてください');
        
        return redirect()->route('users.edit', ['user' => $user])->withErrors($this->messages);
      }
    }

    public function getPrefectures()
    {
      $prefectures = $this->database->getPrefecturesQuery('prefectures');

      return response()->json([
        'prefectures' => $prefectures, 
      ],200, [], JSON_UNESCAPED_UNICODE);

      // 取得失敗時はエラーメッセージを返す
      return new JsonResponse([
        'message' => 'Unauthenticated.'
      ], 500);
    }
}
