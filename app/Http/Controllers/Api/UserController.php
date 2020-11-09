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

    /**
     * ユーザ一覧
     */
    public function index(Request $request)
    {
      /// 検索条件のセット
      $conditions = [];
      if ($request->input('query')) { $conditions['users.name@like'] = $request->input('query'); }

      // 全ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex(null, $conditions);

      return response()->json([
        'users' => $users, 
      ],200, [], JSON_UNESCAPED_UNICODE);

      // 認証失敗時はエラーメッセージを返す
      return new JsonResponse([
        'message' => 'Unauthenticated.'
      ], 401);

    }

    /**
     * ユーザ作成ページ
     */
    public function create()
    {
      // 都道府県データを会員登録フォームに渡す
      $prefectures = $this->database->getCreate('prefectures')->get();

      return view('users.create', [
          'prefectures' => $prefectures,
      ]);
    }

    /**
     * ユーザ保存
     */
    public function store(Request $request)
    {
      DB::beginTransaction();

      // ファイル名の生成
      $filename = null;
      if ($request->file('upload_image')){
        $filename = $this->getFilename($request->file('upload_image'));
      }

      // 登録データを配列化
      $data = $request->input();
      // dd($data);
      // パスワードのハッシュ処理
      $data['password'] = Hash::make($data['password']);
      
      if ($this->database->save($data, $filename)){
        DB::commit();
        return response()->json([
          'info_message' => 'ユーザの登録に成功しました!', 
          'id'           => \Auth::user()->id,
          'name'         => $request->input('name'),
          'password'     => $request->input('password'),
        ],200, [], JSON_UNESCAPED_UNICODE);
      } else {
        DB::rollBack();
        // 作成失敗時はエラーメッセージを返す
        return new JsonResponse([
          'error_message' => 'ユーザの登録に失敗しました!'
        ], 200);
      }

      // $data = $this->database->save($request, $filename);
      // return new JsonResponse([
      //   'info_message' => 'ユーザの作成に成功しました!',
      //     'name'         => $request->input('name'),
      //     'password'     => $request->input('password'),
      //     'id'           => \Auth::user()->id,
      // ], 200);
      // return new JsonResponse([
      //   'error_message' => 'ユーザの作成に失敗しました!管理者に問い合わせてください',
      // ], 200);
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

    /**
     * ユーザ詳細ページ
     */
    public function show($api_user)
    {
      $user = $this->database->getShow($api_user);

      return response()->json([
        'user' => $user, 
      ],200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * ユーザ編集ページ
     */
    public function edit($user)
    {
      $data = $this->database->getEdit($user);

      return view('users.edit', [
        'user' => $data['user'],
        'prefectures' => $data['prefectures'],
      ]);
    }

    /**
     * ユーザ更新
     */
    public function update(Request $request)
    {
      DB::beginTransaction();

      // ファイル名の生成
      $filename = null;
      if ($request->file('upload_image')){
        $filename = $this->getFilename($request->file('upload_image'));
      }
      
      // 登録データを配列化
      $data = $request->input();

      // パスワードのハッシュ処理
      if(key_exists('password', $data)) {
        $data['password'] = Hash::make($data['password']);
      }
      
      if ($this->database->save($data, $filename)){
        DB::commit();
        return response()->json([
          'info_message' => 'ユーザの登録に成功しました!', 
          'name'         => $request->input('name'),
          'password'     => $request->input('password'),
        ],200, [], JSON_UNESCAPED_UNICODE);
      } else {
        DB::rollBack();
        // 作成失敗時はエラーメッセージを返す
        return new JsonResponse([
          'error_message' => 'ユーザの登録に失敗しました!'
        ], 200);
      }
    }

    /**
     * 都道府県取得
     */
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
