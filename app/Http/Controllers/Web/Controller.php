<?php

namespace App\Http\Controllers\Web;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\MessageBag;

/**
 * フロント画面のビュー設定
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $messages;

    public function __construct()
    {
        // セッションに保存するメッセージ用メソッドをインスタンス化
        $this->messages = new MessageBag();
    }

    /**
     * 一覧画面の設定
     */
    public function index()
    {
        return view('admin.layouts.app', []);
    }

    /**
     * 作成画面の設定
     */
    public function create()
    {
        return view('admin.layouts.app', []);
    }

    /**
     * 詳細画面の設定
     */
    public function show($id)
    {
        return view('admin.layouts.app', []);
    }

    /**
     * 編集画面の設定
     */
    public function edit($id)
    {
        return view('admin.layouts.app', []);
    }
    
}
