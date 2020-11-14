<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use App\Service\Web\NewsService;

class NewsController extends Controller
{
    protected $database;

    public function __construct(NewsService $database)
    {

        Parent::__construct();

        // DB操作のクラスをインスタンス化
        $this->database = $database;
    }

    public function index(Request $request)
    {   
        // 検索条件のセット
        $conditions = [];
        $conditions['status'] = 1;
        // 会員限定のニュースを取得するときに検索条件をセット
        if ($request->input('query')) { $conditions['member_flg'] = $request->input('query'); }

        // ニュースデータの取得
        $news = $this->database->getIndex($conditions);

        return response()->json([
            'news' => $news,
        ],200, [], JSON_UNESCAPED_UNICODE);
    }
}
