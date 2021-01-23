<?php

namespace App\Service\Web;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\UserDatabaseInterface;
use App\DataProvider\DatabaseInterface\MessageDatabaseInterface;

use Storage;

class UserService
{

  protected $UserService;
  protected $MessageService;
  
  /* DBリポジトリのインスタンス化 */
  public function __construct(UserDatabaseInterface $service, MessageDatabaseInterface $messageService)
  {
    $this->UserService = $service; 
    $this->MessageService = $messageService;
  }

  /**
   * Indexページ用データを取得するメソッド
   * 引数1：テーブル名, 引数2：検索条件
   */
  public function getIndex($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // ユーザ情報の取得
      $users = $this->UserService->getBaseData($conditions)->orderBy('updated_at', 'desc')->get();
      // フレンド情報取得
      $friends = '';
      if(request()->input('queryId')) {
        $friends = $this->UserService->getFriendsQuery(request()->input('queryId'))->get();
      }
      // メッセージ履歴の取得(メッセージ相手のIDのみ取得)
      $messages = '';
      if(\Auth::user()) {
        $messages = $this->MessageService->getIndexQuery(['user_id' => \Auth::user()->id])->select('messangers.user_id')->get();
      }

      return [
        'users'   => $users,
        'friends' => $friends,
        'messages' => $messages
      ];
    }
    // 指定したテーブルのデータをソートして取得
    return $this->UserService->getQuery($table, $conditions)->latest($table.'.updated_at')->get();

  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数: 検索条件
   * */
  public function getShow($conditions=null)
  {
    return $this->UserService->getBaseData($conditions)->orderBy('updated_at', 'desc')->first();
  }

  /* *
   * createページ用データを取得するメソッド
   * 引数: 検索用テーブル
   * */
  public function getCreate($table)
  {
    return $this->UserService->getQuery($table);
  }

  /* *
   * editページ用データを取得するメソッド
   * 引数: 自身のID
   * */
  public function getEdit($id)
  {
    $data['user'] = $this->UserService->getWhereQuery('users', ['id' => $id])->first();
    $data['prefectures'] = $this->UserService->getQuery('prefectures')->get();

    return $data;
  }
  
  /* *
   * 新規ユーザ保存用メソッド
   * 第一引数:登録データ, 第二引数:ファイル名
   * */
  public function save($data, $filename)
  {
    return $this->UserService->save($data, $filename);
  }

  /*
  ファイルアップロード用メソッド
  第一引数:ファイル, 第二引数:フォルダ名に使用するための値
  */
  public function filestore($file, $foldername)
  {
    return $this->UserService->filestore($file, $foldername);
  }

  /*
  ファイル削除用メソッド
  引数:ファイルパス
  */
  public function fileDelete($request)
  {
    return $this->UserService->fileDelete($request);
  }

  /**
   * 都道府県情報の取得
   * 引数：テーブル名
   */
  public function getPrefecturesQuery($table)
  {
    return $this->UserService->getQuery($table)->get();
  }

  /**
   * フレンド情報の取得
   * 引数1：ユーザID, 引数2：承認ステータス 
   */
  public function getFriendsQuery($user_id, $approve=null)
  {
    // 友達申請が承認された値のみ取得
    return $this->UserService->getFriendsQuery($user_id, $approve)->get();
  }

  /**
   * ログインユーザへの友達リクエストリストの取得
   * 引数：検索条件
   */
  public function getFriendsApplyQuery($conditions)
  {
    // 友達リクエストのユーザデータを取得
    return $this->UserService->getFriendsApplyQuery($conditions)->get();
  }

  /**
   * フレンド情報の更新
   * 引数：データ
   */
  public function getFriendsUpdate($data)
  {
    // 友達申請の保存処理
    $friend = $this->UserService->getSave($data, 'friends');
    // 自身のIDを変数にセット
    key_exists('id', $data) ? $user_id = $friend->user_id_target : $user_id = $friend->user_id;
    // 相手側のIDを変数にセット
    key_exists('id', $data) ? $user_id_target = $friend->user_id : $user_id_target = $friend->user_id_target;
    // 保存したデータをユーザページに表示する用に取得
    $friend = $this->UserService->getFriendsQuery($user_id, false)
                                ->where('myfriends.target_id', '=', $user_id_target)
                                ->first();
    return $friend;
  }

  /**
   * ユーザ作成時のバリデーションチェック
   * 引数：データ
   */
  public function getValidation($data)
  {
    // チェックフラグ
    $check = [];
    // メールアドレスの重複チェック
    if ($data->input('email')) {
      $this->UserService->getExist('users', ['email' => $data->input('email')]) ? 
        $check['email_error'] = config('const.email_error')
      :
        $check['email_error'] = ''
      ;
    }
    // ユーザ名の重複チェック
    if ($data->input('name')) {
      $this->UserService->getExist('users', ['name' => $data->input('name')]) ? 
        $check['name_error'] = config('const.name_error')
      :
        $check['name_error'] = ''
      ;
    }
    // パスワードのチェック
    if ($data->input('password')) {
      // 推奨されない記号等を含んでいないかどうかチェック
      if(!preg_match('/^[0-9a-zA-Z\_@!?#%&]+$/', $data->input('password'))) {
        $check['password_error'] = config('const.password_error');
      }
    }
    // 結果をリターン
    return $check;
  }
}
