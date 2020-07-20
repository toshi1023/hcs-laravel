<?php

namespace App\Service;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface;
use Storage;

class ArticleService
{

  protected $ArticleService;
  // protected $user;
  // protected $prefecture;

  /* DBリポジトリのインスタンス化 */
  public function __construct(DatabaseInterface $service)
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

    // ファイル名が設定されていなければ統一名を代入
    if (!$filename) {
      // ファイル名を変数に代入
      $filename = 'NoImage';
    }

    // 画像をアップロード
    // $file_upload = $this->fileStore($file, $data['nickname']);

    // 画像をアップロードしDBにセット
    // if ($file_upload[0]){

      try {
        
        // 'prof_photo' => $filename,
        // 'photo_path' => $file_upload[1],
        $this->article->prefecture = $data['prefecture'];
        $this->article->title      = $data['title'];
        $this->article->content    = $data['content'];
        $this->article->women_only = $data['women_only'];
        $this->article->user_id    = $data['user_id'];
        
        $this->article->save();

        return true;

      } catch (\Exception $e) {
        \Log::error('article save error:'.$e->getmessage());
        return false;
      }
      
    // }
  } 

  /*
  ファイルアップロード用メソッド
  第一引数:ファイル, 第二引数:フォルダ名に使用するための値
  */
  public function fileStore($file, $foldername)
  {

    if ($file){
      try {
        //s3アップロード開始
        // バケットの`my-rails-app-hcs-first-bucket/{ニックネーム名}`フォルダへアップロード
        $path = Storage::disk('s3')->putFile('my-rails-app-hcs-first-bucket/'.$foldername, $file, 'public');
        // アップロードしたファイルのURLを取得し、DBにセット
        $photo_path = Storage::disk('s3')->url($path);

      } catch (\Exception $e) {
        return [false, null];
      }
      return [true, $photo_path];
    } else {
      // アップロードファイルがなければデフォルトの画像を設定
      return [true, Consts::NO_IMAGE];
    }
  }

  /*
  ファイル削除用メソッド
  引数:ファイルパス
  */
  public function fileDelete($request)
  {
    try {
      // ファイルの削除を実行
      $file = Storage::disk('s3');
      $file->delete($request);
      return true;

    } catch (\Exception $e) {
      
      return false;
      
    }
    
  }

}
