<?php

namespace App\DataProvider;

use App\DataProvider\DatabaseInterface\ArticleDatabaseInterface;
use App\Model\Article;
use App\Model\User;
use App\Model\Prefecture;
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
    public function getBaseData()
    {
        // usersテーブルの値も結合して取得
        return $this->model->leftjoin('users', 'articles.user_id', '=', 'users.id')
                             ->leftjoin('article_images', 'articles.id', '=', 'article_images.article_id')
                             ->select(
                                 'articles.*', 
                                 'users.name', 
                                 'users.gender', 
                                 'users.prof_photo_path', 
                                 'article_images.id as image_id',
                                 'article_images.article_photo_name',
                                 'article_images.article_photo_path',
                             )
                             ->latest('articles.updated_at');
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
            $this->model->fill($data->all());
            $this->model->save();

            $data['id'] = $this->model->id;

            /* イメージの保存メソッド */
            // モデルをインスタンス化
            $model = $this->getModel('article_images');

            // Updateかどうか判別
            if($this->getExist($model, $data['image_id'])) {
                // 更新対象のデータを取得
                $model = $this->getFind($model, $data['image_id']);
            }

            // ファイル名が設定されていなければ統一名を代入
            if (is_null($filename)) {
                $filename = 'NoImage';
            }
            // 画像をアップロード(フロントはユーザネーム、管理画面はメールアドレスをフォルダ名に設定)
            $file_upload = $this->fileStore($data['upload_image'], \Auth::user()->name ? \Auth::user()->name : \Auth::user()->email);

            $model->article_photo_name = $filename;
            $model->article_photo_path = $file_upload[1];
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
    public function fileStore($file, $foldername)
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
    * ファイル削除用メソッド
    * 引数:ファイルパス
    * */
    public function fileDelete($path)
    {
        try {
            // ファイルの削除を実行
            $file = Storage::disk('s3');
            $file->delete($path);
            return true;
        } catch (\Exception $e) {
            \Log::error('article image file delete error:'.$e->getmessage());
            return false;
        }
    }
}