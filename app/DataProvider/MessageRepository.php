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
     * ログインユーザに紐づくメッセージの送受信ユーザをすべて取得
     */
    public function getMessangerQuery($conditions=null) {
        // messagesテーブルの値をUnion結合して取得
        $subQuery = $this->model->select('*', 'user_id_sender as user_id')
                              ->where('user_id_receiver', '=', $conditions['messages.user_id'])
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
        // 送受信のユーザ情報を取得
        $subQuery = $this->getMessangerQuery($conditions);
        
        // usersテーブルの値も結合して取得
        $query = $this->model->selectRaw('distinct(messangers.user_id)')
                             ->addSelect(\DB::raw('max(messangers.id) AS messangers_id'))
                             ->addSelect('users.name', 'users.users_photo_name', 'users.users_photo_path', 'users.gender')
                             ->fromSub($subQuery, 'messangers')
                             ->leftJoin('users', 'users.id', '=', 'messangers.user_id')
                             ->groupByRaw('messangers.user_id');
                             
        // messagesテーブルの内容と結合してログインユーザのメッセージ一覧情報を取得
        $query = $this->model->select('*')
                            //  ->rightJoin(\DB::raw('('.$query->toSql().') AS messangers'), 'messages.id', '=', 'messangers.messangers_id');
                             ->rightJoinSub($query, 'messangers', 'messages.id', '=', 'messangers.messangers_id');
                             
        return $query;

        // 完成形のSQL(ユーザIDが2の場合)
        // SELECT * FROM `messages` RIGHT JOIN (SELECT DISTINCT(messangers.user_id), MAX(messangers.id) AS messangers_id, 
        // `users`.`name`, `users`.`users_photo_name`, `users`.`users_photo_path`, `users`.`gender` 
        // FROM ((SELECT *, `user_id_receiver` AS `user_id` FROM `messages` WHERE `user_id_sender` = 2 AND `delete_flg` = 0) 
        // UNION (SELECT *, `user_id_sender` AS `user_id` FROM `messages` WHERE `user_id_receiver` = 2 AND `delete_flg` = 0) 
        // ORDER BY `updated_at` DESC) AS messangers LEFT JOIN `users` ON `users`.`id` = `messangers`.`user_id` 
        // GROUP BY messangers.user_id) AS messangers ON `messages`.`id` = `messangers`.`messangers_id`
    }

}