<?php

namespace App\Service\Admin;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\AdminDatabaseInterface;
use Storage;

class AdminService
{

  protected $AdminService;
  
  /* DBリポジトリのインスタンス化 */
  public function __construct(AdminDatabaseInterface $service)
  {
    $this->AdminService = $service; 
  }

  /**
   * Indexページ用データを取得するメソッド
   * 引数：検索用テーブル
   */
  public function getIndex($table=null)
  {
    // 全ユーザデータを更新日時順にソートして取得
    return $this->AdminService->getQuery($table)->latest('updated_at');

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
    return $this->AdminService->getSave(null, $data, true);
  }

}
