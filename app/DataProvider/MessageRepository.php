<?php

namespace App\DataProvider;

use App\DataProvider\DatabaseInterface\MessageDatabaseInterface;
use App\Model\Message;
use App\Consts\Consts;

class MessageRepository extends BaseRepository implements MessageDatabaseInterface
{
    public function __construct (Message $message)
    {
        // Messageモデルをインスタンス化
        $this->model = $message;
    }

    /**
     * messagesページのメッセージ履歴データを取得
     */
    public function getBaseData($conditions=null) {
        // usersテーブルの値も結合して取得
        $query = $this->model->leftjoin('users as senders', 'messages.user_id_sender', '=', 'senders.id')
                             ->leftjoin('users as receivers', 'messages.user_id_receiver', '=', 'receivers.id')
                             ->select(
                                 'messages.*', 
                                 'senders.name as sender_name',
                                 'receivers.name as receiver_name', 
                                 'senders.users_photo_path as sender_photo',
                                 'receivers.users_photo_path as receiver_photo',
                                 'senders.gender as sender_gender', 
                             )
                             ->where('messages.delete_flg', '=', 0)
                             ->where(function($query) use($conditions){
                                $query->orWhere('messages.user_id_sender', '=', $conditions['messages.user_id'])
                                      ->orWhere('messages.user_id_receiver', '=', $conditions['messages.user_id']);
                            });
                            
        return $query;
    }

    /**
     * ログインユーザに紐づくメッセージの送受信ユーザを取得
     */
    public function getMessangerQuery($conditions=null) {
        // messagesテーブルの値をUnion結合して取得
        $subQuery = $this->model->select('*', 'user_id_receiver as user_id')
                              ->where('user_id_sender', '=', $conditions['messages.user_id'])
                              ->where('delete_flg', '=', 0);

        $query = $this->model->select('*', 'user_id_receiver as user_id')
                             ->where('user_id_sender', '=', $conditions['messages.user_id'])
                             ->where('delete_flg', '=', 0)
                             ->union($subQuery)
                             ->orderBy('updated_at', 'desc');
        return $query;
    }

    /**
     * messagesページの一覧表示データを取得
     */
    public function getIndexQuery($conditions=null) {
        // 送受信のユーザ情報をSQLに変換して取得
        $subQuery = $this->getMessangerQuery($conditions)->toSql();
        // usersテーブルの値も結合して取得
        $query = $this->model->selectRaw('distinct(messangers.user_id)')
                             ->addSelect(\DB::raw('max(messangers.updated_at)'))
                             ->addSelect('messangers.id', 'messangers.content', 'users.name', 'users.users_photo_name', 'users.users_photo_path')
                             ->from(\DB::raw('('.$subQuery.') AS messangers'))
                             ->leftjoin('users', 'users.id', '=', 'messangers.user_id')
                             ->groupByRaw('messangers.user_id');

        return $query;

        // 完成形のSQL
        // SELECT DISTINCT messangers.user, MAX(messangers.updated_at), messangers.id, 
        // messangers.content, users.name, users.users_photo_name, users.users_photo_path 
        // FROM (SELECT *, user_id_receiver as user FROM `messages` WHERE `user_id_sender` = 2 
        // UNION SELECT *, user_id_sender as user FROM `messages` WHERE `user_id_receiver` = 2 
        // ORDER BY `updated_at` DESC) AS messangers 
        // LEFT JOIN users ON users.id = messangers.user GROUP BY messangers.user
    }

}