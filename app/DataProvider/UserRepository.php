<?php

namespace App\DataProvider;

use App\Model\User;
use App\Model\Prefecture;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class UserRepository extends BaseRepository implements UserDatabaseInterface
{
    protected $user;
    protected $prefecture;

    public function __construct (User $user, Prefecture $prefecture)
    {
        // Userモデルをインスタンス化
        $this->user = $user;

        // Prefectureモデルをインスタンス化
        $this->prefecture = $prefecture;
    }

    /**
     * ユーザ保存用メソッド
     * 第一引数:登録データ, 第二引数:ファイル名, 第三引数:更新対象データ(新規保存の場合はnull)
     */
    public function save($data, $filename, $updateData = null)
    {
        try{
            // 更新対象データが空でない場合は、アップデート処理を実行
            if (!empty($updateData)) {
                if (!$filename) {
                    $updateData->profile_image = $filename;
                }
                $updateData->name       = $data['name'];
                $updateData->nickname   = $data['nickname'];
                $updateData->prefecture = $data['prefecture'];
                $updateData->birthday   = $data['birthday'];
                $updateData->gender     = $data['gender'];
                $updateData->email      = $data['email'];
                $updateData->password   = Hash::make($data['password']);
                $updateData->save();

                return true;
            }

            // ファイル名が設定されていなければ統一名を代入
            if (!$filename) {
            // ファイル名を変数に代入
                $filename = 'NoImage';
            }

            // 画像をアップロード
            $file_upload = $this->fileStore($data['prof_photo'], $data['nickname']);
            
            // 画像をアップロードしDBにセット
            if ($file_upload[0]){
                $this->user->prof_photo  = $filename;
                $this->user->photo_path  = $file_upload[1];
                $this->user->name        = $data['name'];
                $this->user->nickname    = $data['nickname'];
                $this->user->prefecture  = $data['prefecture'];
                $this->user->birthday    = $data['birthday'];
                $this->user->gender      = $data['gender'];
                $this->user->email       = $data['email'];
                $this->user->password    = Hash::make($data['password']);
                
                $this->user->save();
            }
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
            // バケットの`aws-hcs-image/User/{ニックネーム名}`フォルダへアップロード
            $path = Storage::disk('s3')->putFile(env('AWS_USER_BUCKET').$foldername, $file, 'public');
            // アップロードしたファイルのURLを取得し、DBにセット
            $photo_path = Storage::disk('s3')->url($path);

        } catch (\Exception $e) {
            \Log::error('user image file save error:'.$e->getmessage());
            return [false, null];
        }
        // 画像のパスと一緒にリターン
        return [true, $photo_path];

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
}