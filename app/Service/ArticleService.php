<?php

namespace App\Service;

use App\Model\User;
use App\Model\Article;
use App\Model\Prefecture;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class ArticleService implements DatabaseInterface
{

  protected $article;
  protected $prefecture;

  /* モデルのインスタンス化 */
  public function __construct(Article $article, Prefecture $prefecture)
  {
    $this->article = $article;
    $this->prefecture = $prefecture;
  }

  /* データ取得メソッド */
  public function getIndex()
  {
    
    // usersテーブルの値も結合して取得
    $this->article->leftjoin('users', 'users.id', '=', 'articles.user_id')
          ->select('users.*', 'articles.*')
          ->latest('articles.updated_at');

    return $this->article;
  }

  /* データを条件つきで取得するメソッド */
  public function getWhereQuery($conditions=[])
  {
    foreach ($conditions as $key => $value) {
      $conditions[$key] = $key;
      $conditions[$value] = $value;
    }
    
    $this->article->where($conditions[$key], '=', $conditions[$value])
                  ->latest('updated_at');

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
        Article::create([
          // 'prof_photo' => $filename,
          // 'photo_path' => $file_upload[1],
          'prefecture'        => $data['prefecture'],
          'title'    => $data['title'],
          'content'  => $data['content'],
          'women_only'    => $data['women_only'],
          'user_id'      => $data['user_id'],
          
        ]);
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
