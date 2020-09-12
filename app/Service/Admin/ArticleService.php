<?php

namespace App\Service\Admin;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\ArticleDatabaseInterface;
use Storage;

class ArticleService
{

  protected $ArticleService;
  // 保存対象の除外リスト
  protected $except = ['register_mode', 'map', 'delete_flg_on', 'image_flg', 'img_delete'];

  /* DBリポジトリのインスタンス化 */
  public function __construct(ArticleDatabaseInterface $service)
  {
    $this->ArticleService = $service;
  }

  /* Index用データ取得メソッド */
  public function getIndex()
  {
    // 記事を全て取得(Userモデルのテーブルも結合して取得！)
    return $articles = $this->ArticleService->getBaseData();
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
   * 記事 & 記事のイメージ保存用メソッド
   * 第一引数:登録データ, 第二引数:ファイル名
   */
  public function save($data, $filename = null, $updateData = null)
  {
    // 除外処理
    $data = $data->except($this->except);

    return $this->ArticleService->save($data, $filename);
  } 

  /**
    * 記事削除用メソッド
    * 引数:記事ID
    * */
    public function destroy($id)
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
