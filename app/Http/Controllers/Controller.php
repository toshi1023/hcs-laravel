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
        

        // $database = app()->make('DatabaseInterface');
        
        return;
    }
}
