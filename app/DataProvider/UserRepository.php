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
        // AWSのバケット名を設定
        $this->folder = 'users';
    }

    /**
     * usersページの一覧データを取得
     */
    public function getBaseData($conditions=null) {
        return $this->getQuery($this->folder, $conditions, true);
    }

    /**
     * ユーザ保存用メソッド
     * 第一引数:登録データ, 第二引数:ファイル名
     */
    public function save($data, $filename = null)
    {
        try{
            // Updateかどうか判別
            if (key_exists('id', $data) && !is_null($data['id'])) {
                $this->model = $this->getFind($this->model, $data['id']);
            }

            // ファイル名が設定されていなければ統一名を代入
            if (!$filename) {
                $filename = 'NoImage';
            }

            // フォルダ名の設定
            key_exists('name', $data) ? $foldername = $data['name'] : $foldername = $this->model->name;
            
            // 画像をアップロード
            $file = request()->file('upload_image') ? request()->file('upload_image') : null;
            $file_upload = $this->fileSave($file, $foldername, $filename);
            
            // データを保存
            $this->model->users_photo_name = $filename;
            $this->model->users_photo_path = $file_upload[1];
            $this->model->fill($data);
            $this->model->save();

            // ユーザIDもリターン
            return $this->model;
            
        } catch (\Exception $e) {
            \Log::error('database register error:'.$e->getMessage());
            return false;
        }
    } 

    /**
     * usersページのフレンド一覧データを取得
     * 引数1：ユーザID, 引数2：承認済みフラグ
     */
    public function getFriendsQuery($user_id, $approval=null) {
        // サブクエリ(指定したユーザのフレンド履歴を取得)
        $subQueryChild = $this->getQuery('friends', ['user_id_target' => $user_id])->select('id', 'user_id as target_id', 'status', 'updated_at');
        $subQueryParent = $this->getQuery('friends', ['user_id' => $user_id])
                               ->select('id', 'user_id_target as target_id', 'status', 'updated_at')
                               ->union($subQueryChild)
                               ->latest('updated_at');
        
        // 本クエリ(フレンド履歴とユーザ情報をリレーション)
        $query = $this->model->fromSub($subQueryParent, 'myfriends')
                             ->select('*')
                             ->with('auth_friends:id,name,prefecture,birthday,gender,users_photo_name,users_photo_path');

        if($approval == 1) {
            // 友達申請が申請中の値のみに絞る
            $query = $query->where('myfriends.status', '=', 1);
        }
        if($approval == 2) {
            // 友達申請が承認済みの値のみに絞る
            $query = $query->where('myfriends.status', '=', 2);
        }
        if($approval == 3) {
            // 友達申請が却下の値のみに絞る
            $query = $query->where('myfriends.status', '=', 3);
        }

        return $query;

        // 参考SQL(ユーザIDが1の場合)
        // SELECT users.name, users.prefecture, users.gender, users.users_photo_name, users.users_photo_path, myfriends.*
        // FROM ((SELECT id, `user_id_target` AS target_id, `status`, `updated_at` FROM `friends` WHERE `user_id` = 1 AND `delete_flg` = 0)
        // UNION (SELECT id, `user_id` AS target_id, `status`, `updated_at` FROM `friends` WHERE `user_id_target` = 1 AND `delete_flg` = 0)) AS myfriends
        // LEFT JOIN users ON myfriends.target_id = users.id
        // WHERE myfriends.status = 2
    }

    /**
     * mypageページのフレンド申請データを取得
     * 引数1：検索条件
     */
    public function getFriendsApplyQuery($conditions) {
        // サブクエリ
        $subQuery = $this->getQuery('friends', $conditions)->latest('updated_at');

        $query = $this->model->fromSub($subQuery, 'applyfriends')
                             ->select('*')
                             ->with('users:id,name,prefecture,gender,users_photo_name,users_photo_path');
        
        return $query;
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