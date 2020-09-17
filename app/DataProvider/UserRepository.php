<?php

namespace App\DataProvider;

use App\DataProvider\DatabaseInterface\UserDatabaseInterface;
use App\Model\User;
use App\Model\Prefecture;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class UserRepository extends BaseRepository implements UserDatabaseInterface
{
    public function __construct (User $user)
    {
        // Userモデルをインスタンス化
        $this->model = $user;
    }

    /**
     * usersページの一覧データを取得
     */
    public function getBaseData() {
        return $this->getQuery();
    }

    /**
     * ユーザ保存用メソッド
     * 第一引数:登録データ, 第二引数:ファイル名
     */
    public function save($data, $filename = null)
    {
        // dd($data['upload_image']);
        // dd($_FILES['upload_image']);
        try{
            // Updateかどうか判別
            if ($data['id']) {
                $this->model = $this->getFind($this->model, $data['id']);
            }

            // ファイル名が設定されていなければ統一名を代入
            if (!$filename) {
                $filename = 'NoImage';
            }
           
            // 画像をアップロード
            $file_upload = $this->fileStore($data['upload_image'], $data['name']);
            
            // データを保存
            $this->model->prof_photo_name = $filename;
            $this->model->prof_photo_path = $file_upload[1];
            $this->model->fill($data);
            $this->model->save();

            return true;
            
        } catch (\Exception $e) {
            \Log::error('database register error:'.$e->getMessage());
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
                // バケットの'aws-hcs-image/User/{ニックネーム名}'フォルダへアップロード
                $path = Storage::disk('s3')->putFile(config('const.aws_user_bucket').$foldername, $file, 'public');
                // アップロードしたファイルのURLを取得し、DBにセット
                $photo_path = Storage::disk('s3')->url($path);

                // 画像のパスと一緒にリターン
                return [true, $photo_path];

            } catch (\Exception $e) {
                \Log::error('user image file save error:'.$e->getmessage());
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
     */
    public function fileDelete($path)
    {
        try {
            // ファイルの削除を実行
            $file = Storage::disk('s3');
            $file->delete($path);
            return true;
        } catch (\Exception $e) {
            \Log::error('user image file delete error:'.$e->getmessage());
            return false;     
        }
    }

    /**
     * usersページのフレンド一覧データを取得
     * 引数：ユーザID
     */
    public function getFriendsQuery($user_id) {
        return $this->model->leftjoin('friends', 'users.id', '=', 'friends.user_id_requester')
                           ->select('users.*', 'friends.id as frend_id', 'friends.user_id_target')
                           ->where('friends.user_id_requester', '=', $user_id);
    }
}