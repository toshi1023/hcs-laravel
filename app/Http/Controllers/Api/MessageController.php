<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use App\Service\Web\MessageService;
use App\Events\MessageCreated;

class MessageController extends Controller
{
    protected $database;

    public function __construct(MessageService $database)
    {

        Parent::__construct();

        // DB操作のクラスをインスタンス化
        $this->database = $database;
    }

    /**
     * メッセージリストのデータ取得
     */
    public function index(Request $request)
    {   
        try {
            // 検索条件のセット
            $conditions = [];
            if ($request->input('query')) { $conditions['user_id'] = $request->input('query'); }
            
            $messages = $this->database->getMessageLists($conditions);

            return response()->json([
                'message_lists' => $messages,
            ],200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            \Log::error('Message get Error:'.$e->getMessage());
            return response()->json([
              'error_message' => 'メッセージの取得に失敗しました'
            ], 500, [], JSON_UNESCAPED_UNICODE);
        }
    }

    /**
     * 特定ユーザとのメッセージ履歴データを取得
     */
    public function show(Request $request)
    {   
        try {
            // メッセージの取得
            $messages = $this->database->getShow($request->input('queryUserId'), $request->input('queryUserIdTarget'));
    
            return response()->json([
                'messages' => $messages,
            ],200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            \Log::error('Message get Error:'.$e->getMessage());
            return response()->json([
              'error_message' => 'メッセージの取得に失敗しました',
            ], 500, [], JSON_UNESCAPED_UNICODE);
        }
    }

    /**
     * メッセージの更新
     */
    public function update(Request $request)
    {   
        // メッセージデータのバリデーション
        if(empty($request->input('user_id_receiver'))) {
            return response()->json([
                'error_message' => '送信先が選択されていません',
            ], 200, [], JSON_UNESCAPED_UNICODE);
        }
        if(empty($request->input('content'))) {
            return response()->json([
                'error_message' => 'メッセージの内容が入力されていません',
            ], 200, [], JSON_UNESCAPED_UNICODE);
        }

        try {
            // メッセージの保存
            $message = $this->database->getMessageUpdate($request->all());
    
            // Pusherにデータを送信(リアルタイム通信を実行)
            event(new MessageCreated($message));

            return response()->json([
                'messages' => $message['message'],
                'message_lists' => $message['message_list'],
            ],200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            \Log::error('Message get Error:'.$e->getMessage());
            return response()->json([
              'error_message' => 'メッセージの送信に失敗しました!',
            ], 500, [], JSON_UNESCAPED_UNICODE);
        }
    }
}
