<?php

namespace App\DataProvider;

use App\DataProvider\DatabaseInterface\MessageDatabaseInterface;
use App\Model\Message;
use App\Consts\Consts;

class MessageRepository extends BaseRepository implements MessageDatabaseInterface
{
    protected $table;

    public function __construct (Message $message)
    {
        // Messageモデルをインスタンス化
        $this->model = $message;

        // messagesテーブルを変数に代入
        $this->table = 'messages';
    }

    /**
     * messagesテーブルのデータを取得
     */
    public function getBaseData($conditions=null) {
        $query = $this->getQuery($this->table, $conditions, true);
                            
        return $query;
    }

    /**
     * 特定ユーザとのメッセージ履歴をすべて取得
     * 引数1: ユーザID(自身), 引数2: ユーザID(相手側), 引数3: メッセージID
     */
    public function getMessageQuery($user_id, $user_id_target, $id=null) {
        // messagesテーブルの値をUnion結合して取得
        $subQuery = $this->getQuery($this->table, ['user_id_receiver' => $user_id, 'user_id_sender' => $user_id_target])
                         ->select('*', 'user_id_sender as target_id');

        $subQuery = $this->getQuery($this->table, ['user_id_receiver' => $user_id_target, 'user_id_sender' => $user_id])
                         ->select('*', 'user_id_receiver as target_id')
                         ->union($subQuery)
                         ->orderBy('updated_at', 'desc');

        // 本クエリ
        $query = $this->model->select('messages.*', 'users.users_photo_path', 'users.name', 'users.gender')
                             ->fromSub($subQuery, 'messages')
                             ->leftJoin('users', 'users.id', '=', 'messages.target_id');
        
        if($id) {
            $query = $query->where('messages.id', '=', $id);
        }
        
        return $query;

        // 完成系のSQL(ユーザID:1とユーザID:2のメッセージの場合)
        // SELECT `messages`.*, `users`.`users_photo_path`, `users`.`name`, `users`.`gender`
        // FROM
        // (SELECT *, `user_id_receiver` AS `target_id` FROM `messages` WHERE `user_id_sender` = 1 AND `user_id_receiver` = 2 AND `delete_flg` = 0
        // UNION
        // SELECT *, `user_id_sender` AS `target_id` FROM `messages` WHERE `user_id_receiver` = 1 AND `user_id_sender` = 2 AND `delete_flg` = 0
        // ORDER BY `updated_at` DESC) AS `messages`
        // LEFT JOIN `users` ON `messages`.`target_id` = `users`.`id`
    }

    /**
     * messagesページの一覧表示データを取得
     * 引数1: ユーザID(自身), 引数2: メッセージID
     */
    public function getMessageListsQuery($user_id, $id=null) {
        // messagesテーブルの値をUnion結合して取得
        $subQuery = $this->getQuery($this->table, ['user_id_receiver' => $user_id])
                         ->select('*', 'user_id_sender as user_id');

        $subQuery = $this->getQuery($this->table, ['user_id_sender' => $user_id])
                         ->select('*', 'user_id_receiver as user_id')
                         ->union($subQuery)
                         ->orderBy('updated_at', 'desc');
        
        // usersテーブルの値も結合して取得
        $query = $this->model->selectRaw('distinct(messangers.user_id)')
                             ->addSelect(\DB::raw('max(messangers.id) AS messangers_id'))
                             ->addSelect('users.name', 'users.users_photo_name', 'users.users_photo_path', 'users.gender')
                             ->fromSub($subQuery, 'messangers')
                             ->leftJoin('users', 'users.id', '=', 'messangers.user_id')
                             ->groupByRaw('messangers.user_id');
                             
        // messagesテーブルの内容と結合してログインユーザのメッセージ一覧情報を取得
        $query = $this->model->select('*')
                             ->rightJoinSub($query, 'messangers', 'messages.id', '=', 'messangers.messangers_id');

        // messageデータを更新時に更新後のデータを取得
        if($id) {
            $query = $query->where('messages.id', '=', $id);
        }
                             
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