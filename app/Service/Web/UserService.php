<?php

namespace App\Service\Web;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\UserDatabaseInterface;
use Storage;

class UserService
{

  protected $UserService;
  
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
    // dd($this->UserService->getQuery([], ['articles' => 'user_id'])->get());
    return $this->UserService->getQuery($table)->get();

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
  public function getCreate($table)
  {
    return $this->UserService->getAllQuery($table);
  }

  /* *
   * editページ用データを取得するメソッド
   * 引数: 自身のID
   * */
  public function getEdit($id)
  {
    $data['user'] = $this->UserService->getWhereQuery('users', ['id' => $id])->first();
    $data['prefectures'] = $this->UserService->getAllQuery('prefectures')->get();

    return $data;
  }
  
  /* *
   * 新規ユーザ保存用メソッド
   * 第一引数:登録データ, 第二引数:ファイル名, 第三引数:更新対象データ(新規保存の場合はnull)
   * */
  public function userSave($data, $filename, $updateData = null)
  {
    return $this->UserService->save($data, $filename, $updateData);
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

}
