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
      // 検索条件のセット
      $conditions = [];
      if ($request->input('query')) { $conditions['users.name@like'] = $request->input('query'); }
      if ($request->input('queryId')) { $conditions['users.id@not'] = $request->input('queryId'); } // ユーザ一覧に自分を表示しないようにするため

      // 全ユーザデータとフレンド情報を更新日時順にソートして取得
      $data = $this->database->getIndex(null, $conditions);

      return response()->json([
        'users' => $data['users'], 
        'friends' => $data['friends']
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
      try {
        DB::beginTransaction();

        // ファイル名の生成
        $filename = null;
        if ($request->file('upload_image')){
          $filename = $this->getFilename($request->file('upload_image'));
        }
  
        // 登録データを配列化
        $data = $request->input();
  
        // パスワードのハッシュ処理
        $data['password'] = Hash::make($data['password']);
  
        // ユーザ保存処理
        $user = $this->database->save($data, $filename);
        
        DB::commit();
        return response()->json([
          'info_message' => 'ユーザの登録に成功しました', 
          'id'           => $user->id,
          'name'         => $request->input('name'),
          'password'     => $request->input('password'),
        ],200, [], JSON_UNESCAPED_UNICODE);
      } catch (\Exception $e) {
        DB::rollBack();
        // 作成失敗時はエラーメッセージを返す
        return response()->json([
          // 'error_message' => 'ユーザの登録に失敗しました',
          'error_message' => $e->getMessage(),
          'status'        => 500,
        ], 500, [], JSON_UNESCAPED_UNICODE);
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

    /**
     * ユーザ詳細ページ
     */
    public function show(Request $request)
    {
      // 検索条件のセット
      $conditions = [];
      $conditions['status'] = 0;
      if ($request->input('query')) { $conditions['id'] = $request->input('query'); }
        
      $user = $this->database->getShow($conditions);

      return response()->json([
        'user' => $user, 
      ],200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * ユーザ詳細ページ(初期表示用)
     */
    public function initShow(Request $request)
    {
      // 検索条件のセット
      $conditions = [];
      $conditions['status'] = 0;
      if ($request->input('query')) { $conditions['id'] = $request->input('query'); }
        
      $user = $this->database->getShow($conditions);

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
      try {
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
        $user = $this->database->save($data, $filename);
        DB::commit();
        return response()->json([
          'info_message' => 'ユーザの登録に成功しました!', 
          'name'         => $request->input('name'),
          'password'     => $request->input('password'),
        ],200, [], JSON_UNESCAPED_UNICODE);
      } catch (\Exception $e) {
        DB::rollBack();
        // 作成失敗時はエラーメッセージを返す
        return response()->json([
          'error_message' => 'ユーザの登録に失敗しました!'
        ], 500, [], JSON_UNESCAPED_UNICODE);
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

    /**
     * フレンド情報の取得
     */
    public function friendsIndex(Request $request) 
    {
      // ユーザのフレンド情報を取得
      $friends = $this->database->getFriendsQuery($request->input('query'), 2);

      return response()->json([
        'friends' => $friends, 
      ],200, [], JSON_UNESCAPED_UNICODE);

      // 取得失敗時はエラーメッセージを返す
      return response()->json([
        'message' => 'Unauthenticated.'
      ], 500, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * フレンド情報の取得(ログインユーザへの友達リクエストを含む)
     */
    public function friendsApply(Request $request) 
    {
      // 検索条件のセット
      $conditions = [];
      $conditions['status'] = 1;
      if ($request->input('query')) { $conditions['user_id_target'] = $request->input('query'); }

      // ログインユーザのフレンド情報を取得
      $friends = $this->database->getFriendsQuery($request->input('query'));
      // ログインユーザへの友達リクエスト送信中のユーザ情報を取得
      $friendStatus = $this->database->getFriendsApplyQuery($conditions);
      
      return response()->json([
        'friends' => $friends,
        'friendStatus' => $friendStatus,
      ],200, [], JSON_UNESCAPED_UNICODE);

      // 取得失敗時はエラーメッセージを返す
      return response()->json([
        'message' => 'Unauthenticated.'
      ], 500, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * フレンド情報の更新
     */
    public function friendsUpdate(Request $request) 
    {
      try {
        DB::beginTransaction();

        // ユーザのフレンド情報を取得
        $friend = $this->database->getFriendsUpdate($request->all());
        
        // メッセージの分岐
        $request->input('status') ? $message = 'リクエストを承認しました' : $message = 'リクエストを受け付けました';

        DB::commit();
        return response()->json([
          'friend' => $friend, 
          'info_message' => $message
        ],200, [], JSON_UNESCAPED_UNICODE);

      } catch (\Exception $e) {
        DB::rollBack();
        // 取得失敗時はエラーメッセージを返す
        return new JsonResponse([
          'error_message' => 'リクエストの処理の失敗しました'
        ], 500);
      }
    }
}
