<?php

namespace App\DataProvider;

use App\DataProvider\DatabaseInterface\ArticleDatabaseInterface;
use App\Model\Article;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Storage;
use Exception;

class ArticleRepository extends BaseRepository implements ArticleDatabaseInterface
{

    protected $articleImage;

    /* モデルのインスタンス化 */
    public function __construct(Article $article)
    {
        // Articleモデルをインスタンス化
        $this->model = $article;
        // AWSのバケット名を設定
        $this->folder = 'articles';
    }

    /**
     * articlesページの一覧データを取得
     * 引数1：検索条件, 引数2：ユーザID
     */
    public function getBaseData($conditions=null, $user_id=0)
    {
        // users,article_images,likesテーブルの値も結合して取得
        $query = $this->getQuery($this->folder, $conditions)
                      ->select('*')
                      ->leftJoinSub($this->getLikesCountQuery(), 'likes_counts', 'articles.id', '=', 'likes_counts.article_id')
                      ->with([
                          'users:id,name,gender,users_photo_path',
                          'article_images:id as image_id,articles_photo_name,articles_photo_path,article_id',
                          'likes_counts' => function ($query) {
                            // 各記事のいいね数を取得
                            $query->select(DB::raw('count(user_id) as likes_counts'), 'article_id')
                                  ->groupByRaw('article_id')
                                  ->where('delete_flg', '=', 0);
                          },
                          'likes' => function ($query) use ($user_id) {
                            $query->select('article_id','user_id')
                                  ->where('user_id', '=', $user_id)
                                  ->where('delete_flg', '=', 0);
                          },
                          'comments:id,article_id,user_id,comment',
                          'comments.users:id,name,users_photo_path'  // commentsテーブルのリレーション先であるusersテーブルの情報を取得
                        ]);
        
        return $query;
    }

    /**
     * 記事 & イメージ保存用メソッド
     * 第一引数:登録データ, 第二引数:ファイル名
     */
    public function save($data, $filename = null)
    {
        try {
            /* 記事の保存メソッド */
            // Updateかどうか判別
            if (key_exists('id', $data) && !is_null($data['id'])) {
                $this->model = $this->getFind($this->model, $data['id']);
            }
            
            // データを保存
            $this->model->fill($data);
            $this->model->save();

            $articleData = $this->model;            
            $data['id'] = $this->model->id;
            $data['user_id'] = $this->model->user_id;
            
            /* イメージの保存メソッド */
            // テーブル名を変数に代入
            $table = 'article_images';
            // モデルをインスタンス化
            $model = $this->getModel($table);
            // フォルダ名の取得
            $foldername = $this->getQuery('users', ['id' => $data['user_id']])->first()->name;
            
            // Updateかどうか判別
            if(key_exists('image_id', $data) && $this->getExist($table, ['id' => $data['image_id']])) {
                // 更新対象のデータを取得
                $model = $this->getFind($model, $data['image_id']);
            }

            // データ更新時にファイル名が変更されていない場合
            if($model->id && $model->articles_photo_name === $filename) {
                // 処理を終了
                return $articleData;
            }
            // ファイル名が設定されていなければ統一名を代入
            if (is_null($filename)) {
                $filename = 'NoImage';
            }
            
            // 画像をアップロード
            $file = request()->file('upload_image') ? request()->file('upload_image') : null;
            
            $file_upload = $this->fileSave($file, $foldername, $filename);

            $model->articles_photo_name = $filename;
            $model->articles_photo_path = $file_upload[1];
            $model->article_id = $data['id'];
            $model->user_id = $data['user_id'];
            $model->save();

            return $articleData;

        } catch (Exception $e) {
            \Log::error('article save error:'.$e->getmessage());
            return false;
        }
    }

    /**
     * 記事のいいね数を取得
     * 
     */
    private function getLikesCountQuery() 
    {
        $query = $this->getQuery('likes')
                      ->select(DB::raw('count(user_id) as likes_counts'), 'article_id')
                      ->groupByRaw('article_id');

        return $query;
    }

    /**
     * 記事のいいねデータを取得(管理画面用)
     * 引数：記事ID
     */
    public function getLikesAdminPage($conditions=null)
    {
        $query = $this->getQuery('likes', $conditions)
                      ->with('users:id,name,gender,users_photo_path');

        return $query;
    }

    /**
     * 記事のいいねデータを取得
     * 引数：ユーザID
     */
    public function getLikes($user_id)
    {
        // 記事ごとにいいね数をカウント
        $subQueryA = $this->getLikesCountQuery();
        
        // Likeモデルをインスタンス化
        $model = $this->getModel('likes');
        
        // ログインユーザのいいね有無を確認
        $subQueryB = $model->select('user_id', 'article_id as likes_user_article_id')
                           ->from('likes as likes_user')
                           ->where('delete_flg', '=', 0)
                           ->where('user_id', '=', $user_id);

        // 記事に関するデータといいねデータを結合
        $query = $model->select('articles.id as article_id', 'likes_user.user_id', 'likes_counts.likes_counts')
                       ->fromSub($subQueryA, 'likes_counts')
                       ->rightJoin('articles', 'articles.id', '=', 'likes_counts.article_id')
                       ->leftJoinSub($subQueryB, 'likes_user', 'articles.id', '=', 'likes_user.likes_user_article_id')
                       ->where('articles.delete_flg', '=', 0);
        
        return $query;

        // 完成形のSQL(ユーザIDが2の場合)
        // SELECT `articles`.`id` AS `article_id`, `articles`.`title`, `likes_user`.`user_id`, `likes_counts`.`likes_counts`
        // FROM (SELECT COUNT(`article_id`) AS `likes_counts`, `article_id` FROM `likes` WHERE `delete_flg` = 0 GROUP BY `article_id`) AS `likes_counts` 
        // RIGHT JOIN `articles` ON `articles`.`id` = `likes_counts`.`article_id` 
        // LEFT OUTER JOIN (SELECT `user_id`, `article_id` AS `likes_user_article_id` 
        // FROM `likes` WHERE `delete_flg` = 0 AND `user_id` = 2) AS `likes_user` 
        // ON `articles`.`id` = `likes_user`.`likes_user_article_id`
    }

    /**
     * いいね数の更新処理
     * 引数：保存するデータ
     */
    public function likeSave($data)
    {
        \DB::beginTransaction();
        
        try {
            // Likeモデルをインスタンス化
            $model = $this->getModel('likes');
            // 更新時の場合は更新用データを取得
            if (key_exists('id', $data)) {
                $model = $this->getFind($model, $data['id']);
            }

            // データを保存
            $model->fill($data);
            $model->save();

            \DB::commit();
            // リターン
            return true;

        } catch (Exception $e) {
            \Log::error('database save error:'.$e->getMessage());
            \DB::rollBack();
            return false;
        }
    }

    /**
     * 記事のコメント数を取得
     * 引数：検索条件
     */
    public function getCommentsCounts($conditions=null)
    {
        // 記事ごとのコメント数をカウント
        $query = $this->getQuery('comments', $conditions)
                      ->select(DB::raw('count(id) as comments_counts'), 'article_id')
                      ->groupByRaw('article_id');

        return $query;
    }

    /**
     * 記事のコメントデータを取得
     * 引数：検索条件
     */
    public function getComments($conditions=null)
    {
        // 記事ごとのコメントとユーザ情報を取得
        $query = $this->getQuery('comments', $conditions)
                      ->select('id', 'comment', 'user_id', 'article_id', 'updated_at')
                      ->with('users:id,name as user_name,gender,users_photo_path');

        return $query;
    }
}