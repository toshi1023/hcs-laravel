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

    /**
     * ニュース一覧
     */
    public function index(Request $request)
    {   
        try {
            // 検索条件のセット
            $conditions = [];
            $conditions['status'] = 1;
            // 会員限定のニュースを取得するときに検索条件をセット
            if ((int)$request->input('query') == 0 && $request->input('query') != 'undefined') { $conditions['member_flg'] = $request->input('query'); }
            
            // ニュースデータの取得
            $news = $this->database->getIndex($conditions);

            return response()->json([
                'news' => $news,
            ],200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            \Log::error('News get Error:'.$e->getMessage());
            return response()->json([
              'error_message' => 'ニュースの取得に失敗しました!'
            ], 500, [], JSON_UNESCAPED_UNICODE);
        }

        
    }

    /**
     * ニュース詳細(初期表示用)
     */
    public function initShow(Request $request)
    {   
        try {
            // 検索条件のセット
            $conditions = [];
            $conditions['status'] = 1;
            // 会員限定のニュースを取得するときに検索条件をセット
            if ((int)$request->input('query') == 0 && $request->input('query') != 'undefined') { $conditions['member_flg'] = $request->input('query'); }
            
            // ニュースデータの取得
            $news = $this->database->getShow($conditions);
            return response()->json([
                'news' => $news,
            ],200, [], JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            \Log::error('News get Error:'.$e->getMessage());
            return response()->json([
              'error_message' => 'ニュースの取得に失敗しました!'
            ], 500, [], JSON_UNESCAPED_UNICODE);
        }
    }
}
