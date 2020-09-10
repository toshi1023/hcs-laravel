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

    // ログイン認証後
    Route::middleware('auth:admin')->group(function () {

        // ルートページ
        Route::get('/home', 'HomeController@index')->name('home');

        // 管理ユーザ関連のルート
        Route::get('admins',                'AdminController@index')->name('hcs-admin.admins.index');
        Route::get('admins/create',         'AdminController@create')->name('hcs-admin.admins.create');
        Route::get('admins/{admin}',        'AdminController@show')->name('hcs-admin.admins.show');
        Route::get('admins/{admin}/edit',   'AdminController@edit')->name('hcs-admin.admins.edit');
        Route::post('admins/save',          'AdminController@save')->name('hcs-admin.admins.save');
        Route::post('admins/delete',        'AdminController@destroy')->name('hcs-admin.admins.destroy');

        // ユーザ関連のルート
        Route::get('users',                 'UserController@index')->name('hcs-admin.users.index');
        Route::get('users/create',          'UserController@create')->name('hcs-admin.users.create');
        Route::get('users/{user}',          'UserController@show')->name('hcs-admin.users.show');
        Route::get('users/{user}/edit',     'UserController@edit')->name('hcs-admin.users.edit');
        Route::post('users/save',           'UserController@save')->name('hcs-admin.users.save');
        Route::post('users/delete',         'UserController@destroy')->name('hcs-admin.users.destroy');
        
        // 記事関連のルート
        Route::resource('articles', 'ArticleController');
        
        // ニュース関連のルート
        Route::resource('news', 'NewsController');

        /**
         * Api通信ルート
         */
        // 管理ユーザ一覧
        Route::get('ajax/admins', 'AdminController@apiIndex')->name('admin');
        // ユーザ一覧
        Route::get('ajax/users', 'UserController@apiIndex')->name('user');

        // // ユーザデータのPDF出力ルート
        // Route::get('users/pdf', 'UserController@pdf')->name('users.pdf');
    });
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
    Route::get('/home', 'HomeController@index')->name('home2');

    Route::get('/welcome', 'HomeController@welcome')->name('welcome');

    // 記事関連のルート
    Route::resource('articles', 'ArticleController');
    // Route::resource('articles' , 'Api\ArticleController');

    // ユーザ関連のルート
    Route::resource('users', 'UserController');
    
    // メッセージ関連のルート
    // Route::resource('messages', 'MessageController');

    // ログアウト機能のルーティング
    Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
});
