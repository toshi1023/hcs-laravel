<?php

namespace App\Service\Web;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\ArticleDatabaseInterface;
use Storage;

class ArticleService
{

  protected $ArticleService;

  /* DBリポジトリのインスタンス化 */
  public function __construct(ArticleDatabaseInterface $service)
  {
    $this->ArticleService = $service;
  }

  /* Index用データ取得メソッド */
  public function getIndex()
  {
    // 記事を全て取得(Userモデルのテーブルも結合して取得！)
    $articles = $this->ArticleService->getBaseData()->get();

    // 会員限定公開をされていない記事のみ取得
    $free_articles = $this->ArticleService->getBaseData()->where('type', '=', 0)->get();

    // 都道府県取得
    $prefectures = $this->ArticleService->getQuery('prefectures')->get();

    return [
      'articles' => $articles, 
      'free_articles' => $free_articles,
      'prefectures' => $prefectures
    ];
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

  /*
  ファイル削除用メソッド
  引数:ファイルパス
  */
  public function fileDelete($request)
  {
    return $this->ArticleService->fileDelete($request);
  }

}
