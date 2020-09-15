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
  public function getIndex($table=null)
  {
    // 全ユーザデータを更新日時順にソートして取得
    return $this->NewsService->getQuery($table)->latest('news.updated_at');

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
   * 第一引数:登録データ, 第二引数:ファイル名
   * */
  public function save($data, $filename)
  {
    return $this->NewsService->save($data, $filename);
  }
}
