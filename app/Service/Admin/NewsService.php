<?php

namespace App\Service\Admin;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\NewsDatabaseInterface;
use Storage;

class NewsService
{

  protected $NewsService;
  // 保存対象の除外リスト
  protected $except = [];
  
  /* DBリポジトリのインスタンス化 */
  public function __construct(NewsDatabaseInterface $service)
  {
    $this->NewsService = $service; 
  }

  /**
   * Indexページ用データを取得するメソッド
   * 引数：検索用テーブル
   */
  public function getIndex($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // ニュースデータを取得
      return $this->NewsService->getBaseData($conditions);
    }
    // 指定したテーブルのデータをソートして取得
    return $this->NewsService->getQuery($table, $conditions)->latest($table.'.updated_at');
  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数: ユーザID
   * */
  public function getShow($id)
  {
    return $this->NewsService->getWhereQuery('news', ['id' => $id])->first();
  }

  /* *
   * createページ用データを取得するメソッド
   * 引数: 検索用テーブル
   * */
  public function getCreate($table=null)
  {
    return $this->NewsService->getQuery($table)->get();
  }

  /* *
   * editページ用データを取得するメソッド
   * 引数: ニュースID
   * */
  public function getEdit($id)
  {
    $data['news'] = $this->NewsService->getWhereQuery('news', ['id' => $id])->first();
    $data['prefectures'] = $this->NewsService->getQuery('prefectures')->get();

    return $data;
  }
  
  /* *
   * 新規ユーザ保存用メソッド
   * 第一引数:登録データ
   * */
  public function save($data)
  {
    // 除外処理
    $data = $data->except($this->except);

    return $this->NewsService->getSave($data);
  }

  /**
    *ニュース削除用メソッド
    * 引数:ニュースID
    * */
    public function remove($id)
    {
      return $this->NewsService->getDestroy($id);
    }
}
