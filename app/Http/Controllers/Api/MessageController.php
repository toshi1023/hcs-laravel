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

    public function index(Request $request)
    {   
        // 検索条件のセット
        $conditions = [];
        if ($request->input('query')) { $conditions['messages.user_id'] = $request->input('query'); }
        
        $messages = $this->database->getIndex(null, $conditions);

        return response()->json([
            'messages' => $messages,
        ],200, [], JSON_UNESCAPED_UNICODE);
    }

}
