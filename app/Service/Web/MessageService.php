<?php

namespace App\Service\Web;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\MessageDatabaseInterface;
use Storage;

class MessageService
{

  protected $MessageService;

  /* DBリポジトリのインスタンス化 */
  public function __construct(MessageDatabaseInterface $service)
  {
    $this->MessageService = $service;
  }

  /**
   * Indexページ用データ取得メソッド
   * 引数1：テーブル名, 引数2：検索条件
   */
  public function getIndex($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // ログインユーザのメッセージを全て取得
      return $messages = $this->MessageService->getBaseData($conditions)->get();

    }
    // 指定したテーブルのデータをソートして取得
    return $this->ArticleService->getQuery($table, $conditions)->latest($table.'.updated_at');
  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数: ユーザID
   * */
  public function getShow($id)
  {
    // 記事と紐づくユーザ情報の値を取得
    return $this->ArticleService->getBaseData()->where('articles.id', '=' , $id)->first();
  }

  /* *
   * createページ用データを取得するメソッド
   * 引数: 検索用テーブル
   * */
  public function getCreate($request)
  {
    return $this->ArticleService->getQuery($request)->get();
  }

  /* *
   * editページ用データを取得するメソッド
   * 引数: 自身のID(管理者の場合は選択した記事のID)
   * */
  public function getEdit($id)
  {
    //  自身の記事テーブルの値を取得
    $data['article'] = $this->ArticleService->getBaseData()->where('articles.id', '=' , $id)->first();

    // 都道府県データをすべて取得
    $data['prefectures'] = $this->ArticleService->getQuery('prefectures')->get();

    return $data;
  }

  /**
   * 記事保存用メソッド
   * 第一引数:登録データ, 第二引数:ファイル名, 第三引数:更新対象データ(新規保存の場合はnull)
   */
  public function articleSave($data, $filename = null, $updateData = null)
  {
    return $this->ArticleService->save($data, $filename, $updateData);
  } 

  /**
    * 記事削除用メソッド
    * 引数:記事ID
    * */
    public function articleDestroy($id)
    {
      return $this->ArticleService->destroy('articles', $id);
    }

}
