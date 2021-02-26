<?php

namespace App\Service\Web;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\MessageDatabaseInterface;
use Storage;

class MessageService
{

  protected $MessageService;

  /* DBリポジトリのインスタンス化 */
  public function __construct(MessageDatabaseInterface $service)
  {
    $this->MessageService = $service;
  }

  /**
   * Indexページ用データ取得メソッド
   * 引数：検索条件
   */
  public function getMessageLists($conditions=null)
  {
    // ログインユーザのメッセージを全て取得
    return $this->MessageService->getMessageListsQuery($conditions)->get();
  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数1：ユーザID(自身), 引数2: ユーザID(相手側)
   * */
  public function getShow($user_id, $user_id_target)
  {
    // 特定ユーザとのメッセージ履歴を全て取得
    return $this->MessageService->getMessageQuery($user_id, $user_id_target)->orderBy('messages.created_at', 'asc')->get();
  }

  /**
   * メッセージ一覧情報の更新
   * 引数：データ
   */
  public function getMessageListUpdate($data)
  {
    // メッセージの保存処理
    $message = $this->MessageService->getSave($data, 'messages');

    // メッセージリストのデータも更新
    $message_list = $this->MessageService->getMessageListsQuery($message->user_id_sender, $message->id)->first();

    // 作成したデータを取得
    $message = $this->MessageService->getMessageQuery($message->user_id_sender, $message->user_id_receiver, $message->id)
                    ->orderBy('messages.created_at', 'asc')
                    ->first();
    
    return [
      'message'  => $message,
      'message_list' => $message_list
    ];
  }

  /**
   * メッセージ情報の更新
   * 引数：データ
   */
  public function getMessageUpdate($data)
  {
    // メッセージの保存処理
    $message = $this->MessageService->getSave($data, 'messages');

    // メッセージリストのデータも更新
    $message_list = $this->MessageService->getMessageListsQuery($message->user_id_sender, $message->id)->first();
    // リアルタイム通信用のメッセージリストのデータを更新
    $realtime_message_list = $this->MessageService->getMessageListsQuery($message->user_id_receiver, $message->id)->first();

    // 作成したデータを取得
    $message = $this->MessageService->getMessageQuery($message->user_id_sender, $message->user_id_receiver, $message->id)
                                    ->orderBy('messages.created_at', 'asc')
                                    ->first();
    
    return [
      'message'  => $message,
      'message_list' => $message_list,
      'realtime_message_list' => $realtime_message_list
    ];
  }

}
