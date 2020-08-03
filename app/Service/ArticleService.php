<?php

namespace App\Service;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\ArticleDatabaseInterface;
use Storage;

class ArticleService
{

  protected $ArticleService;
  // protected $user;
  // protected $prefecture;

  /* DBリポジトリのインスタンス化 */
  public function __construct(ArticleDatabaseInterface $service)
  {
    // $this->ArticleService = app()->make(DatabaseInterface::class);
    $this->ArticleService = $service;
  }

  /* Index用データ取得メソッド */
  public function getIndex()
  {
    // 記事を全て取得(Userモデルのテーブルも結合して取得！)
    $articles = $this->ArticleService->getIndex()->get();

    // 女性限定公開をされていない記事のみ取得
    $women_only_articles = $this->ArticleService->getWhereQuery(['women_only' => 0])->get();

    return [$articles, $women_only_articles];
  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数: ユーザID
   * */
  public function getShow($request)
  {
    // 記事と紐づくユーザ情報の値を取得
    $this->user->where('id', '=',$request)->first();

    return $this->user;
  }

  /* *
   * editページ用データを取得するメソッド
   * 引数: 自身のID
   * */
  public function getEdit($request)
  {
    //  自身の記事テーブルの値を取得
    $data['article'] = $this->article->where('user_id', '=',$request);

    // 都道府県データをすべて取得
    $data['prefecture'] = $this->prefecture::all();

    return $data;

  }

  /* データを条件つきで取得するメソッド */
  public function getWhereQuery($conditions=[])
  {
    foreach ($conditions as $key => $value) {
      $conditions[$key] = $key;
      $conditions[$value] = $value;
    }
    
    // $this->article->where($conditions[$key], '=', $conditions[$value])
    $this->article->where('women_only', '=', 0)
                  ->latest('updated_at');

    // dd($this->article);
    return $this->article;

  }

  /*
  記事保存用メソッド
  第一引数:登録データ, 第二引数:ファイル名 ,第三引数:ファイルデータ
  */
  public function save($data, $filename = null, $file = null)
  {
    return $this->ArticleService->save($data, $filename, $file);
  } 

  /*
  ファイルアップロード用メソッド
  第一引数:ファイル, 第二引数:フォルダ名に使用するための値
  */
  public function fileStore($file, $foldername)
  {
    return $this->ArticleService->filestore($file, $foldername);
  }

  /**
    * 記事削除用メソッド
    * 引数:記事ID
    * */
    public function destroy($request)
    {
      return $this->ArticleService->destroy($request);
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
