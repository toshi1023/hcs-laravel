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
   * 引数1：テーブル名, 引数2：検索条件
   */
  public function getIndex($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // ユーザ情報の取得
      return $this->UserService->getBaseData($conditions)->get();
    }
    // 指定したテーブルのデータをソートして取得
    return $this->UserService->getQuery($table, $conditions)->latest($table.'.updated_at')->get();

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

}
