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
     * messagesページの一覧データを取得
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
                             )
                             ->where('messages.delete_flg', '=', 0);
        
        // 検索条件が設定されている場合は検索を実行
        if(!is_null($conditions)) {
            $query = $this->getWhereQuery(null, $conditions, $query);
        }
        return $query;
    }

}