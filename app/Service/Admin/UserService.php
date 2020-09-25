<?php

namespace App\Service\Admin;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\UserDatabaseInterface;
use Storage;

class UserService
{

  protected $UserService;
  // 保存対象の除外リスト
  protected $except = ['password_confirmation', 'image_flg', 'delete_flg_on', 'img_delete'];
  
  /* DBリポジトリのインスタンス化 */
  public function __construct(UserDatabaseInterface $service)
  {
    $this->UserService = $service; 
  }

  /**
   * Indexページ用データを取得するメソッド
   * 引数：検索用テーブル
   */
  public function getIndex($table=null)
  {
    // 全ユーザデータを更新日時順にソートして取得
    return $this->UserService->getQuery($table)->latest('users.updated_at');

  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数: ユーザID
   * */
  public function getShow($id)
  {
    return $this->UserService->getWhereQuery('users', ['id' => $id])->first();
  }

  /* *
   * createページ用データを取得するメソッド
   * 引数: 検索用テーブル
   * */
  public function getCreate($table=null)
  {
    return $this->UserService->getQuery($table)->get();
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
    // 除外処理
    $data = $data->except($this->except);

    return $this->UserService->save($data, $filename);
  }

  /*
  ファイルアップロード用メソッド
  第一引数:ファイル, 第二引数:フォルダ名に使用するための値
  */
  public function fileSave($file, $foldername)
  {
    return $this->UserService->fileSave($file, $foldername);
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
   * フレンド情報の取得
   * 引数：ユーザID
   */
  public function getFriendsQuery($user_id)
  {
    return $this->UserService->getFriendsQuery($user_id);
  }

  /**
   * ユーザの削除
   * 引数：ユーザID
   */
  public function remove($id)
  {
    return $this->UserService->getDestroy($id);
  }

}
