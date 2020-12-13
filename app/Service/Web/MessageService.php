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
   * 引数1：テーブル名, 引数2：検索条件
   */
  public function getIndex($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // ログインユーザのメッセージを全て取得
      return $this->MessageService->getIndexQuery($conditions)->get();
    }
    // 指定したテーブルのデータをソートして取得
    return $this->MessageService->getQuery($table, $conditions)->latest($table.'.updated_at')->get();
  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数1：テーブル名, 引数2：検索条件
   * */
  public function getShow($table=null, $conditions=null)
  {
    if(is_null($table)) {
      // 特定ユーザとのメッセージ履歴を全て取得
      return $this->MessageService->getMessageQuery($conditions)->orderBy('messages.created_at', 'asc')->get();
    }
    // 指定したテーブルのデータをソートして取得
    return $this->MessageService->getQuery($table, $conditions)->latest($table.'.updated_at')->get();
  }

  /**
   * メッセージ一覧情報の更新
   * 引数：データ
   */
  public function getMessageListUpdate($data)
  {
    // メッセージの保存処理
    $message = $this->MessageService->getSave($data, 'messages');

    // 検索条件
    $conditions = [
      'user_id' => $message->user_id_sender,
    ];

    // メッセージリストのデータも更新
    $message_list = $this->MessageService->getIndexQuery($conditions, $message->id)->first();

    // 検索条件を追加
    $conditions['user_id_target'] = $message->user_id_receiver;

    // 作成したデータを取得
    $message = $this->MessageService->getMessageQuery($conditions, $message->id)->orderBy('messages.created_at', 'asc')->first();
    
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

    // 検索条件
    $conditions = [
      'user_id' => $message->user_id_sender,
    ];

    // メッセージリストのデータも更新
    $message_list = $this->MessageService->getIndexQuery($conditions, $message->id)->first();
    // リアルタイム通信用のメッセージリストのデータを更新
    $realtime_message_list = $this->MessageService->getIndexQuery(['user_id' => $message->user_id_receiver], $message->id)->first();

    // 検索条件を追加
    $conditions['user_id_target'] = $message->user_id_receiver;

    // 作成したデータを取得
    $message = $this->MessageService->getMessageQuery($conditions, $message->id)->orderBy('messages.created_at', 'asc')->first();
    
    return [
      'message'  => $message,
      'message_list' => $message_list,
      'realtime_message_list' => $realtime_message_list
    ];
  }

}
