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
                                 'article_images.article_photo_name',
                                 'article_images.article_photo_path',
                             )
                             ->latest('articles.updated_at');
    }

    /**
     * 記事保存用メソッド
     * 第一引数:登録データ, 第二引数:ファイル名
     */
    public function articleSave($data, $filename = null)
    {
        try {
            // Updateかどうか判別
            if (key_exists('id', $data) && $data['id']) {
                $this->model = $this->getFind($this->model, $data['id']);
            }

            // データを保存
            $this->model->fill($data);
            $this->model->save();

            // 新規作成の場合は保存した記事情報のIDを配列に追加
            if (!key_exists('id', $data) && !$data['id']) {
                $data['id'] = $this->model->id;
            }

            // 記事イメージの保存処理を実行
            $this->imageSave($data, $filename);

        } catch (\Exception $e) {
            \Log::error('article save error:'.$e->getmessage());
            return false;
        }
    }

    /**
     * 記事イメージ保存用メソッド
     * 第一引数:登録データ, 第二引数:ファイル名
     */
    public function imageSave($data, $filename = null)
    {
        try {
            // モデルをインスタンス化
            $model = $this->getModel('article_images');

            /* 更新パターン */
            if($this->getExist($model, $data['id'])) {
                // データが存在すれば更新処理へ
                $model = $this->getFind($model, $data['id']);

                // 画像をアップロード
                $file_upload = $this->fileStore($data['upload_image'], \Auth::user()->name);
                // ファイル名が設定されていなければ統一名を代入
                if (!$filename) {
                    // ファイル名を変数に代入
                    $filename = 'NoImage';
                }

                $model->article_photo_name = $filename;
                $model->article_photo_path = $file_upload[1];
                $model->article_id = $data['id'];
                $model->user_id = $data['user_id'];

                $model->save();

                return true;
            }

            /* 新規登録パターン */

            // ファイル名が設定されていなければ統一名を代入
            if (!$filename) {
                // ファイル名を変数に代入
                $filename = 'NoImage';
            }

            $model->article_photo_name = $filename;
            $model->article_photo_path = $file_upload[1];
            $model->article_id = $data['id'];
            $model->user_id = $data['user_id'];

            $model->save();

            return true;
            
        } catch (\Exception $e) {
            \Log::error('image save error:'.$e->getmessage());
            return false;
        }
    }

    /**
     * ファイルアップロード用メソッド
     * 第一引数:ファイル, 第二引数:フォルダ名に使用するための値
     */
    public function fileStore($file, $foldername)
    {
        if ($file){
        try {
            //s3アップロード開始
            // バケットの`aws-hcs-image/User/{ニックネーム名}`フォルダへアップロード
            $path = Storage::disk('s3')->putFile(env('AWS_ARTICLE_BUCKET').$foldername, $file, 'public');
            // アップロードしたファイルのURLを取得し、DBにセット
            $photo_path = Storage::disk('s3')->url($path);

        } catch (\Exception $e) {
            \Log::error('article image file save error:'.$e->getmessage());
            return [false, null];
        }
            return [true, $photo_path];
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