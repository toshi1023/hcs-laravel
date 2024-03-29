<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Service\Web\UserService;
use Exception;

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
      try {
        // 検索条件のセット
        $conditions = [];
        if ($request->input('query')) { $conditions['users.name@like'] = $request->input('query'); }
        if ($request->input('queryId')) { $conditions['users.id@not'] = $request->input('queryId'); } // ユーザ一覧に自分を表示しないようにするため
        
        // 全ユーザデータとフレンド情報を更新日時順にソートして取得
        $data = $this->database->getIndex($conditions);
        
        return response()->json([
          'users'     => $data['users'],
          'friends'   => $data['friends'],
          'messages'  => $data['messages']
        ],200, [], JSON_UNESCAPED_UNICODE);
      } catch (Exception $e) {
        \Log::error('User get Error:'.$e->getMessage());
        return response()->json([
          'error_message' => 'ユーザの取得に失敗しました!'
        ], 500, [], JSON_UNESCAPED_UNICODE);
      }
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

        // セッションにパスワードを一時的に保存(ログイン後にセッションから削除する)
        session()->put('password', $request->input('password'));
        
        DB::commit();
        return response()->json([
          'info_message' => 'ユーザの登録に成功しました', 
          'id'           => $user->id,
        ],200, [], JSON_UNESCAPED_UNICODE);
      } catch (Exception $e) {
        \Log::error('user save error:'.$e->getMessage());
        DB::rollBack();
        // 作成失敗時はエラーメッセージを返す
        return response()->json([
          'error_message' => 'ユーザの登録に失敗しました',
          'status'        => 500,
        ], 500, [], JSON_UNESCAPED_UNICODE);
      }
    }

    /**
     * ユーザ詳細ページ
     */
    public function show(Request $request)
    {
      try {
        // 検索条件のセット
        $conditions = [];
        
        if ($request->input('query')) { $conditions['id'] = $request->input('query'); }
          
        $user = $this->database->getShow($conditions);
        
        if ($user->status === 2 || $user->status === 4) {
          throw new Exception('unsubscribed the user or suspended the account');
        }
 
        return response()->json([
          'user' => $user,
        ],200, [], JSON_UNESCAPED_UNICODE);
      }  catch (Exception $e) {
        \Log::error('User get Error:'.$e->getMessage());
        return response()->json([
          'error_message' => 'ユーザの取得に失敗しました!'
        ], 500, [], JSON_UNESCAPED_UNICODE);
      }
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
          'name'         => $user->name,
        ],200, [], JSON_UNESCAPED_UNICODE);
      } catch (Exception $e) {
        \Log::error('user update error:'.$e->getMessage());
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
      try {
        $prefectures = $this->database->getPrefecturesQuery('prefectures');
  
        return response()->json([
          'prefectures' => $prefectures, 
        ],200, [], JSON_UNESCAPED_UNICODE);
      }  catch (Exception $e) {
        return response()->json([
          'error_message' => '都道府県の取得に失敗しました!'
        ], 500, [], JSON_UNESCAPED_UNICODE);
      }
    }

    /**
     * フレンド情報の取得
     */
    public function friendsIndex(Request $request) 
    {
      try {
        // ユーザのフレンド情報を取得(申請ステータスが承認済みのものに限定)
        $friends = $this->database->getFriendsQuery($request->input('query'), config('const.approval'));
        
        return response()->json([
          'friends'   => $friends, 
        ],200, [], JSON_UNESCAPED_UNICODE);
      }  catch (Exception $e) {
        \Log::error('Friend get Error:'.$e->getMessage());
        return response()->json([
          'error_message' => 'フレンドの取得に失敗しました!'
        ], 500, [], JSON_UNESCAPED_UNICODE);
      }
    }

    /**
     * フレンド情報の取得(ログインユーザへの友達リクエストを含む)
     */
    public function friendsApply(Request $request) 
    {
      try {
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
      }  catch (Exception $e) {
        \Log::error('Friend get Error:'.$e->getMessage());
        return response()->json([
          'error_message' => 'フレンドの取得に失敗しました!'
        ], 500, [], JSON_UNESCAPED_UNICODE);
      }
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

      } catch (Exception $e) {
        \Log::error('Friend update Error:'.$e->getMessage());
        DB::rollBack();
        // 取得失敗時はエラーメッセージを返す
        return response()->json([
          'error_message' => 'リクエストの処理の失敗しました'
        ], 500, [], JSON_UNESCAPED_UNICODE);
      }
    }

    /**
     * ユーザ登録情報のバリデーションチェック
     */
    public function validation(Request $request) 
    {
      try {
        // バリデーションチェック
        $validation = $this->database->getValidation($request);
        
        return response()->json([
          'validation' => $validation
        ],200, [], JSON_UNESCAPED_UNICODE);

      } catch (Exception $e) {
        \Log::error('Validation Error:'.$e->getMessage());
        // 取得失敗時はエラーメッセージを返す
        return response()->json([
          'error_message' => 'リクエストの処理の失敗しました'
        ], 500, [], JSON_UNESCAPED_UNICODE);
      }
    }
}
