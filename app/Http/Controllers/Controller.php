<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

use App\Consts\Consts;
use App\Service\UserService;
use App\Service\ArticleService;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /* DBへの保存をサービスコンテナにて解決 */
    public function serviceBind () 
    {
        // 現在のURLを変数に代入
        $current_url = url()->current();

        // 現在のURLに'article'という値を含まなければfalseをリターン
        if (strpos($current_url, Consts::ARTICLE_URL) === false){
            // DatabaseInterfaceをUserServiceのインスタンス化で解決
            app()->bind(DatabaseInterface::class, UserService::class);
        } else {
            // DatabaseInterfaceをArticleServiceのインスタンス化で解決
            app()->bind(DatabaseInterface::class, ArticleService::class);
        }

        $database = app()->make(DatabaseInterface::class);
        
        return $database;
    }
}
