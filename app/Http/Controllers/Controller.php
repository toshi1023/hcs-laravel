<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\MessageBag;

use App\Consts\Consts;
use App\Service\DatabaseInterface;
use App\Service\UserService;
use App\Service\ArticleService;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $messages;

    public function __construct()
    {
        // セッションに保存するメッセージ用メソッドをインスタンス化
        $this->messages = new MessageBag();
    }

    /* DBへの保存をサービスコンテナにて解決 */
    public function serviceBind () 
    {
        // 現在のURLを変数に代入
        $current_url = url()->current();

        // 現在のURLに'article'という値を含む場合
        if (strpos($current_url, Consts::ARTICLE_URL) > 0){

            // DatabaseInterfaceをArticleServiceのインスタンス化で解決
            app()->bind(DatabaseInterface::class, ArticleService::class);

        // 現在のURLに'user'という値を含む場合
        } elseif (strpos($current_url, Consts::USER_URL) > 0) {

            // DatabaseInterfaceをUserServiceのインスタンス化で解決
            app()->bind(DatabaseInterface::class, UserService::class);
        }

        $database = app()->make(DatabaseInterface::class);
        
        return $database;
    }
}
