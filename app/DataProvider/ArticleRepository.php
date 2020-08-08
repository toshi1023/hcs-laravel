<?php

namespace App\DataProvider;

use App\Model\Article;
use App\Model\User;
use App\Model\Prefecture;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class ArticleRepository extends BaseRepository implements ArticleDatabaseInterface
{
    protected $article;
    protected $user;
    protected $prefecture;

    /* モデルのインスタンス化 */
    public function __construct(Article $article, User $user, Prefecture $prefecture)
    {
        $this->article = $article;
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
                      ->select('articles.*', 'users.*')
                      ->latest('articles.updated_at');
    }

    /* Index用データ取得メソッド */
    public function getIndex()
    {
        // 記事の全データをリターン
        return $this->getArticle();
    }

    /* *
    * Showページ用データを取得するメソッド
    * 引数: ユーザID
    * */
    public function getShow($request)
    {
        // 記事の対象データを一件リターン
        return $this->getArticle()->where('articles.id', '=' , $request)->first();
    }

    /* *
    * editページ用データを取得するメソッド
    * 引数: 自身のID(管理者の場合は選択した記事のID)
    * */
    public function getEdit($request)
    {
        //  自身の記事テーブルの値を取得
        $data['article'] = $this->getArticle()->where('articles.id', '=' , $request)->first();

        // 都道府県データをすべて取得
        $data['prefecture'] = $this->getAllQuery('prefectures')->get();

        return $data;
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

    /**
    * 記事削除用メソッド
    * 引数:記事ID
    * */
    public function destroy($request)
    {
        try {
            //  対象の記事を削除
            $this->article->where('id', '=',$request)->delete();
            return true;
        } catch (\Exception $e) {
            \Log::error('article destroy error:'.$e->getmessage());
            return false; 
        }
    }

    /**
    * ファイル削除用メソッド
    * 引数:ファイルパス
    * */
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