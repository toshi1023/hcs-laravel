<?php

namespace App\Service\Web;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
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

  /**
   * Homeページ用データ取得メソッド
   * ※5件のみ取得して返す
   * 引数1：テーブル名, 引数2：検索条件
   */
  public function getHome($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // 記事をいいね！が多い順に5件だけ取得
      $user_id = Auth::user() ? Auth::user()->id : 0 ;
      
      // ログインユーザ向けにデータをリターン
      if ($user_id) {
        return $this->ArticleService->getBaseData($conditions, $user_id)->orderBy('likes_counts', 'desc')->limit(5)->get();
      }
      // 非ログインユーザ向けにデータをリターン
      return $this->ArticleService->getBaseData($conditions, $user_id)
                                  ->where('type', '=', config('const.public'))
                                  ->orderBy('likes_counts', 'desc')
                                  ->limit(5)
                                  ->get();
    }
    // 指定したテーブルのデータをソートして取得
    return $this->ArticleService->getQuery($table, $conditions)->latest($table.'.updated_at');
  }

  /**
   * Indexページ用データ取得メソッド
   * 引数1：テーブル名, 引数2：検索条件
   */
  public function getIndex($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // 記事を全て取得
      $user_id = Auth::user() ? Auth::user()->id : 0 ;
      return $this->ArticleService->getBaseData($conditions, $user_id)->latest('updated_at')->get();
    }
    // 指定したテーブルのデータをソートして取得
    return $this->ArticleService->getQuery($table, $conditions)->latest($table.'.updated_at');
  }

  /**
   * 記事保存用メソッド
   * 第一引数:登録データ, 第二引数:ファイル名
   */
  public function save($data, $filename = null)
  {
    // 記事を保存
    $article = $this->ArticleService->save($data, $filename);
    
    // 保存したデータを一覧ページに必要なデータにカスタムして取得
    return $this->ArticleService->getBaseData(['articles.id' => $article->id])->first();
  }

  /**
    * 記事削除用メソッド
    * 引数:記事ID
    * */
    public function articleDestroy($id)
    {
      return $this->ArticleService->getDestroy($id, 'articles');
    }

  /**
   * ファイル削除用メソッド
   * 引数:ファイルパス
   */
  public function fileDelete($request)
  {
    return $this->ArticleService->fileDelete($request);
  }

  /**
   * 記事のいいね情報を取得するメソッド
   * 引数：検索条件
   */
  public function getLikes($conditions=null)
  { 
    // 記事のいいね情報を取得
    $data = $this->ArticleService->getLikes($conditions['user_id'])->get();

    return [
      'data' => $data,
    ];
  }

  /* *
   * いいねの更新を実行するメソッド
   * 引数: データ(記事ID, ユーザID)
   * */
  public function getLikesUpdate($data)
  {
    // 保存するデータの配列を生成
    $data = [
      'article_id' => $data['article_id'],
      'user_id'    => $data['user_id'],
    ];
    
    // 値の更新処理
    if($this->ArticleService->getExist('likes', ['article_id' => $data['article_id'], 'user_id' => $data['user_id']])) {
      // 更新用データの取得
      $update_data = $this->ArticleService->getQuery('likes', ['article_id' => $data['article_id'], 'user_id' => $data['user_id']], [], false)->first();

      // 削除フラグの切り替え
      if($update_data->delete_flg == 0) {
        $update_data->delete_flg = 1;
      } else {
        $update_data->delete_flg = 0;
      }

      // 配列にIDと削除フラグの更新値を格納
      $data['id'] = $update_data->id;
      $data['delete_flg'] = $update_data->delete_flg;

      // 保存処理
      $this->ArticleService->likeSave($data);
    } else {
      // 値の新規登録
      $this->ArticleService->likeSave($data);
    }

    // 記事データを再取得してリターン
    return $this->ArticleService->getBaseData(['id' => $data['article_id']])->first();
  }

  /**
   * 記事のコメント情報を取得するメソッド
   * 引数：検索条件
   */
  public function getComments($conditions=null)
  { 
    // 記事のコメント情報を取得
    return $this->ArticleService->getComments($conditions)->orderBy('updated_at', 'asc')->get();
  }

  /**
   * 記事のコメント数を取得するメソッド
   * 引数：検索条件
   */
  public function getCommentsCounts($conditions=null)
  { 
    // 記事のコメント数を取得
    return $this->ArticleService->getCommentsCounts($conditions)->get();
  }

  /* *
   * コメントの更新を実行するメソッド
   * 引数: データ(記事ID, ユーザID, コメントデータ)
   * */
  public function getCommentsUpdate($data)
  {
    // コメントテーブルにデータを保存
    $comment = $this->ArticleService->getSave($data, 'comments');
    // コメントを作成した記事データを取得して返す
    return $this->ArticleService->getBaseData(['id' => $comment->article_id], $comment->user_id)->first();
  }

}
