<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use App\Service\Web\MessageService;

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
            
            $messages = $this->database->getIndex(null, $conditions);

            return response()->json([
                'messages' => $messages,
            ],200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            \Log::error('Message get Error:'.$e->getMessage());
            return response()->json([
              'error_message' => 'メッセージの取得に失敗しました!'
            ], 500, [], JSON_UNESCAPED_UNICODE);
        }
    }

    /**
     * 特定ユーザとのメッセージ履歴データを取得
     */
    public function show(Request $request)
    {   
        try {
            // 検索条件のセット
            $conditions = [];
            if ($request->input('queryUserId')) { $conditions['user_id'] = $request->input('queryUserId'); }
            if ($request->input('queryUserIdTarget')) { $conditions['user_id_target'] = $request->input('queryUserIdTarget'); }

            // メッセージの取得
            $messages = $this->database->getShow(null, $conditions);
    
            return response()->json([
                'messages' => $messages,
            ],200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            \Log::error('Message get Error:'.$e->getMessage());
            return response()->json([
              'error_message' => 'メッセージの取得に失敗しました!',
            ], 500, [], JSON_UNESCAPED_UNICODE);
        }
    }

    /**
     * メッセージの更新
     */
    public function update(Request $request)
    {   
        try {
            // メッセージの保存
            $message = $this->database->getMessageUpdate($request->all());
    
            return response()->json([
                'messages' => $message,
            ],200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            \Log::error('Message get Error:'.$e->getMessage());
            return response()->json([
              'error_message' => 'メッセージの送信に失敗しました!',
            ], 500, [], JSON_UNESCAPED_UNICODE);
        }
    }
}
