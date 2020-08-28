<?php

use Illuminate\Support\Facades\Route;

/**
 * 管理者ページのルーティング
 * 
 * URL: hcs-admin/{ルーティングで設定したアドレス}
 * フォルダの名前スペース: Admin/{各コントローラファイル}
 */
Route::prefix('hcs-admin')->namespace('Admin')->name('hcs-admin.')->group(function(){
    // 認証機能のルーティング
    Auth::routes(['register' => false, 'reset' => false, 'verify' => false]);

    // ルートページ
    Route::get('/home', 'HomeController@index')->name('admin_home');
});


/**
 * フロントページのルーティング
 * 
 */
Route::namespace('Web')->group(function(){
    // ログイン機能のルーティング
    Auth::routes(['register' => false, 'reset' => false, 'verify' => false]);

    // ルートページ
    Route::get('/', 'HomeController@index')->name('home');

    Route::get('/welcome', 'HomeController@welcome')->name('welcome');

    // 記事関連のルート
    Route::resource('articles', 'ArticleController');
    // Route::resource('articles' , 'Api\ArticleController');

    // ユーザ関連のルート
    Route::resource('users', 'UserController');
    // ユーザデータのPDF出力ルート
    Route::get('users/pdf', 'UserController@pdf')->name('users.pdf');

    // ログアウト機能のルーティング
    Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
});
