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
  public function getIndex($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // 記事を全て取得(Userモデルのテーブルも結合して取得)
      return $this->ArticleService->getBaseData($conditions);
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
    $article = $this->ArticleService->getBaseData(['articles.id' => $id])->first();
    // 記事をいいねしたユーザデータを取得
    $like_user_count = $this->ArticleService->getQuery('likes', ['likes.article_id' => $id, 'likes.user_id' => \Auth::user()->id])->first();
  
    return [
      'article' => $article,
      'user' => $like_user_count,
    ];
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
    public function remove($id)
    {
      return $this->ArticleService->getDestroy($id);
    }

  /*
  ファイル削除用メソッド
  引数:ファイルパス
  */
  public function fileDelete($request)
  {
    return $this->ArticleService->fileDelete($request);
  }

  /* *
   * いいねの更新を実行するメソッド
   * 引数: 記事ID
   * */
  public function getLikesUpdate($article_id)
  {
    // 保存するデータの配列を生成
    $data = [
      'article_id' => $article_id,
      'user_id'    => \Auth::user()->id,
    ];

    // 値の更新処理
    if($this->ArticleService->getExist('likes', ['article_id' => $data['article_id'], 'user_id' => $data['user_id']])) {
      // 更新用データの取得
      $update_data = $this->ArticleService->getQuery('likes', ['article_id' => $data['article_id'], 'user_id' => $data['user_id']])->first();
      // 削除フラグの切り替え
      if($update_data->delete_flg == 0) {
        $update_data->delete_flg = 1;
      } else {
        $update_data->delete_flg = 0;
      }

      // 保存処理
      $result = $this->ArticleService->likeSave($update_data->all());
    } else {
      // 値の新規登録
      $result = $this->ArticleService->likeSave($data);
    }
    
    // 保存したデータをDBから取得
    $data = $this->ArticleService->getQuery('likes', ['article_id' => $data['article_id'], 'user_id' => $data['user_id']])->first();
    
    // 結果をリターン
    return $response = [
      'result'  => $result,
      'data'    => $data,
    ];
  }

}
