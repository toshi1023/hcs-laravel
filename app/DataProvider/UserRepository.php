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
    public function getBaseData($conditions=null) {
        return $this->getQuery('users', $conditions, [], true);
    }

    /**
     * ユーザ保存用メソッド
     * 第一引数:登録データ, 第二引数:ファイル名
     */
    public function save($data, $filename = null)
    {
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
            $file = key_exists('upload_image', $data) ? $data['upload_image'] : null;
            $file_upload = $this->fileSave($file, $data['name']);
            
            // データを保存
            $this->model->users_photo_name = $filename;
            $this->model->users_photo_path = $file_upload[1];
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
    public function fileSave($file, $foldername)
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
     * usersページのフレンド一覧データを取得
     * 引数：ユーザID
     */
    public function getFriendsQuery($user_id) {
        return $this->model->leftjoin('friends', 'users.id', '=', 'friends.user_id')
                           ->leftJoin('users as targets', 'friends.user_id_target', '=', 'targets.id')
                           ->select('users.id', 'users.name as user_name', 'users.updated_at', 
                                    'friends.id as friend_id', 'friends.user_id_target',
                                    'friends.status', 'targets.users_photo_name', 'targets.users_photo_path',
                                    'targets.name as friend_name', 'targets.prefecture'
                                    )
                           ->where('friends.user_id', '=', $user_id);
    }

    /**
     * 送信者に紐づくメッセージのデータをカウント
     * 引数：ユーザID(受信者ID)
     */
    public function getMessagesCountQuery($user_id) {
        return $this->model->leftjoin('messages', 'users.id', '=', 'messages.user_id_sender')
                           ->selectRaw('count(messages.id) as message_count')
                           ->addSelect('messages.user_id_sender')
                           ->groupByRaw('messages.id')
                           ->where('messages.user_id_receiver', '=', $user_id)
                           ->orWhere('messages.user_id_sender', '=', $user_id);
    }
    /**
     * usersページのメッセージ送信者一覧データを取得
     * 引数：ユーザID(受信者ID)
     */
    public function getSendersQuery($user_id) {

        $count = $this->getMessagesCountQuery($user_id);
        
        return $this->model->leftJoinSub($count, 'c', 'users.id', '=', 'c.user_id_sender')
                           ->leftjoin('messages', 'users.id', '=', 'messages.user_id_sender')
                           ->selectRaw('distinct(messages.user_id_sender)')
                           ->addSelect('users.*', 'c.message_count')
                           ->where('messages.user_id_receiver', '=', $user_id);
    }
    /**
     * usersページの送信者とログインユーザ同士のメッセージ一覧データを取得
     * 引数1：ユーザID(受信者ID), 引数2：送信者ID
     */
    public function getMessagesQuery($user_id, $sender_id) {
        return $this->model->leftjoin('messages', 'users.id', '=', 'messages.user_id_sender')
                           ->addSelect('messages.*', 'users.name', 'users.users_photo_path')
                           ->whereIn('messages.user_id_receiver', [$user_id])
                           ->whereIn('messages.user_id_sender', [$sender_id, $user_id]);
    }
    
}