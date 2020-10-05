<?php

namespace App\Service\Admin;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\AdminDatabaseInterface;
use Storage;

class AdminService
{

  protected $AdminService;
  // 保存対象の除外リスト
  protected $except = ['register_mode'];
  
  /* DBリポジトリのインスタンス化 */
  public function __construct(AdminDatabaseInterface $service)
  {
    $this->AdminService = $service; 
  }

  /**
   * Indexページ用データを取得するメソッド
   * 引数：検索用テーブル
   */
  public function getIndex($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // ユーザデータを取得
      return $this->AdminService->getBaseData($conditions);
    }
    // 指定したテーブルのデータをソートして取得
    return $this->AdminService->getQuery($table, $conditions)->latest($table.'.updated_at');

  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数: ユーザID
   * */
  public function getShow($id)
  {
    return $this->AdminService->getWhereQuery('users', ['id' => $id])->first();
  }

  /* *
   * createページ用データを取得するメソッド
   * 引数: 検索用テーブル
   * */
  public function getCreate($table=null)
  {
    return $this->AdminService->getQuery($table);
  }

  /* *
   * editページ用データを取得するメソッド
   * 引数: 管理ユーザのID
   * */
  public function getEdit($id)
  {
    $data = $this->AdminService->getWhereQuery('admins', ['id' => $id])->first();

    return $data;
  }
  
  /* *
   * ユーザ保存用メソッド
   * 第一引数:登録データ
   * */
  public function save($data)
  {
    // 除外処理
    $data = $data->except($this->except);

    return $this->AdminService->getSave($data);
  }

  /**
   * 管理ユーザの削除
   * 引数：管理ユーザID
   */
  public function remove($id)
  {
    return $this->AdminService->getDestroy($id);
  }

}
