<?php

namespace App\DataProvider;

use App\DataProvider\DatabaseInterface\ArticleDatabaseInterface;
use App\Model\Article;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class ArticleRepository extends BaseRepository implements ArticleDatabaseInterface
{

    protected $articleImage;

    /* モデルのインスタンス化 */
    public function __construct(Article $article)
    {
        $this->model = $article;
    }

    /**
     * articlesページの一覧データを取得
     */
    public function getBaseData($conditions=null)
    {
        // 各記事のいいね数を取得
        $likes = $this->getLikesCountQuery();

        // usersテーブルの値も結合して取得
        $query = $this->model->leftjoin('users', 'articles.user_id', '=', 'users.id')
                             ->leftjoin('article_images', 'articles.id', '=', 'article_images.article_id')
                             ->leftJoinSub($likes, 'likes_counts', 'articles.id', '=', 'likes_counts.article_id')
                             ->select(
                                 'articles.*', 
                                 'users.name', 
                                 'users.gender', 
                                 'users.users_photo_path', 
                                 'article_images.id as image_id',
                                 'article_images.articles_photo_name',
                                 'article_images.articles_photo_path',
                                 'likes_counts.likes_counts',
                             )
                             ->where('articles.delete_flg', '=', 0);
        
        // 検索条件が設定されている場合は検索を実行
        if(!is_null($conditions)) {
            $query = $this->getWhereQuery(null, $conditions, $query);
        }
        return $query;
    }

    /**
     * 記事のいいね数を取得
     * 
     */
    private function getLikesCountQuery() {
        $query = $this->model()->query();

        $query->leftjoin('likes', 'articles.id', '=', 'likes.article_id')
              ->selectRaw('count(likes.user_id) as likes_counts')
              ->addSelect('likes.article_id')
              ->groupByRaw('likes.article_id')
              ->where('likes.delete_flg', '=', 0);

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
            if ($data['id']) {
                $this->model = $this->getFind($this->model, $data['id']);
            }
            
            // データを保存
            $this->model->fill($data);
            $this->model->save();
            
            $data['id'] = $this->model->id;
            
            /* イメージの保存メソッド */
            // テーブル名を変数に代入
            $table = 'article_images';
            // モデルをインスタンス化
            $model = $this->getModel($table);
            
            // Updateかどうか判別
            if(!is_null($data['image_id']) && $this->getExist($table, ['id' => $data['image_id']])) {
                // 更新対象のデータを取得
                $model = $this->getFind($model, $data['image_id']);
            }

            // ファイル名が設定されていなければ統一名を代入
            if (is_null($filename)) {
                $filename = 'NoImage';
            }
            
            // 画像をアップロード(フロントはユーザネーム、管理画面はメールアドレスをフォルダ名に設定)
            $file = key_exists('upload_image', $data) ? $data['upload_image'] : null;
            $file_upload = $this->fileSave($file, \Auth::user()->name ? \Auth::user()->name : \Auth::user()->email);

            $model->articles_photo_name = $filename;
            $model->articles_photo_path = $file_upload[1];
            $model->article_id = $data['id'];
            $model->user_id = $data['user_id'];
            $model->save();

            return true;

        } catch (\Exception $e) {
            \Log::error('article save error:'.$e->getmessage());
            return false;
        }
    }

    /**
     * ファイルアップロード用メソッド
     * 第一引数:ファイル, 第二引数:フォルダ名に使用するための値
     */
    public function fileSave($file, $foldername)
    {
        if (!is_null($file)){
            try {
                //s3アップロード開始
                // バケットの`aws-hcs-image/User/{ニックネーム名}`フォルダへアップロード
                $path = Storage::disk('s3')->putFile(config('const.aws_article_bucket').$foldername, $file, 'public');
                // アップロードしたファイルのURLを取得し、DBにセット
                $photo_path = Storage::disk('s3')->url($path);

                return [true, $photo_path];

            } catch (\Exception $e) {
                \Log::error('article image file save error:'.$e->getmessage());
                return [false, null];
            }
        } else {
            // アップロードファイルがなければデフォルトの画像を設定
            return [true, env('AWS_NOIMAGE')];
        }
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

        } catch (\Exception $e) {
            \Log::error('database save error:'.$e->getMessage());
            \DB::rollBack();
            return false;
        }
    }
}