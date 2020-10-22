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
        Route::resource('admins', 'AdminController');

        // ユーザ関連のルート
        Route::resource('users', 'UserController');
        
        // 記事関連のルート
        Route::resource('articles', 'ArticleController')->middleware('dataFilter');
        
        // ニュース関連のルート
        Route::resource('news', 'NewsController');

        /**
         * Api通信ルート
         */
        // 管理ユーザ一覧
        Route::get('ajax/admins', 'AdminController@apiIndex')->name('api_admin');
        // ユーザ一覧
        Route::get('ajax/users', 'UserController@apiIndex')->name('api_user');
        // 記事一覧
        Route::get('ajax/articles', 'ArticleController@apiIndex')->name('api_article');
        // ニュース一覧
        Route::get('ajax/news', 'NewsController@apiIndex')->name('api_news');
        // フレンド一覧
        Route::get('ajax/users/{user}/friends', 'UserController@apiFriendsIndex')->name('api_friends');
        // フレンド削除
        Route::delete('users/{user}/friends/{frend_id}', 'UserController@friendsDestroy')->name('api_friends.destroy');
        // いいね一覧
        Route::get('ajax/articles/{article}/likes', 'ArticleController@apiLike')->name('api_articles.likes.index');
        // いいねの新規登録
        Route::post('ajax/articles/{article}/likes/create', 'ArticleController@apiLikeCreate')->name('api_article.likes.create');
        // いいね数の更新
        Route::post('ajax/articles/{article}/likes/update', 'ArticleController@apiLikeUpdate')->name('api_article.likes.update');
        // いいねの削除
        // Route::post('ajax/articles/{article}/likes/destroy', 'ArticleController@apiLikeDestroy')->name('api_article.likes.destroy');
        // メッセージ一覧(送信者リスト)
        Route::get('ajax/users/{user}/messages', 'UserController@apiSenderIndex')->name('api_senders');
        // メッセージ一覧(メッセージリスト)
        Route::get('ajax/users/{user}/messages/{sender}', 'UserController@apiMessagesIndex')->name('api_messages');
        // メッセージの削除
        Route::post('ajax/users/{user}/messages/destroy', 'UserController@apiMessagesDestroy')->name('api_messages.destroy');
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
