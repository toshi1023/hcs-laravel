<?php

namespace App\DataProvider;

use App\Model\Article;
use App\Model\User;
use App\Model\Prefecture;
use App\Model\ArticleImage;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class ArticleRepository extends BaseRepository implements ArticleDatabaseInterface
{
    protected $article;
    protected $articleImage;
    protected $user;
    protected $prefecture;

    /* モデルのインスタンス化 */
    public function __construct(Article $article, ArticleImage $articleImage,User $user, Prefecture $prefecture)
    {
        $this->article = $article;
        $this->articleImage = $articleImage;
        $this->user = $user;
        $this->prefecture = $prefecture;
    }

    /**
     * articlesページに関わるデータの取得
     */
    public function getArticle()
    {
        // usersテーブルの値も結合して取得
        return $this->article->leftjoin('users', 'articles.user_id', '=', 'users.id')
                             ->leftjoin('article_images', 'article_images.article_id', '=', 'articles.id')
                             ->select(
                                 'articles.*', 
                                 'users.nickName', 
                                 'users.gender', 
                                 'users.photo_path', 
                                 'article_images.article_photo',
                                 'article_images.photo_path',
                             )
                             ->latest('articles.updated_at');
    }

    /**
     * 記事保存用メソッド
     * 第一引数:登録データ, 第二引数:ファイル名, 第三引数:更新対象データ(新規保存の場合はnull)
     */
    public function save($data, $filename = null, $updateData = null)
    {
        try {
            // 更新対象データが空でない場合は、アップデート処理を実行
            if (!empty($updateData)) {
                if (!$filename) {
                    $updateData->article_photo = $filename;
                }
                $updateData->prefecture = $data['prefecture'];
                $updateData->title      = $data['title'];
                $updateData->content    = $data['content'];
                $updateData->women_only = $data['women_only'];
                $updateData->user_id    = $data['user_id'];
                
                $updateData->save();

                return true;
            }
            
            // ファイル名が設定されていなければ統一名を代入
            if (!$filename) {
                // ファイル名を変数に代入
                $filename = 'NoImage';
            }

            $this->article->prefecture      = $data['prefecture'];
            $this->article->title           = $data['title'];
            $this->article->content         = $data['content'];
            $this->article->women_only      = $data['women_only'];
            $this->article->user_id         = $data['user_id'];
            
            $this->article->save();

            // 画像をアップロード
            $file_upload = $this->fileStore($data['article_photo'], \Auth::user()->nickname);

            // 画像をアップロードしDBにセット
            if ($file_upload[0]){
                $this->articleImage->article_photo = $filename;
                $this->articleImage->photo_path    = $file_upload[1];
                $this->articleImage->article_id    = $this->article->id;
                $this->articleImage->user_id       = $this->article->user_id;

                $this->articleImage->save();
            }


            return true;

        } catch (\Exception $e) {
            \Log::error('article save error:'.$e->getmessage());
            return false;
        }
        
        // }
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