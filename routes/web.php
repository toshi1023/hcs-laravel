<?php

use Illuminate\Support\Facades\Route;

/**
 * 管理者ページのルーティング
 * 
 * URL: hcs-admin/{ルーティングで設定したアドレス}
 * フォルダの名前スペース: Admin/{各コントローラファイル}
 */
Route::prefix('hcs-admin')->namespace('Admin')->name('hcs-admin.')->group(function(){

    /********** 認証管理(login) **********/
    Auth::routes(['register' => false, 'reset' => false, 'verify' => false]);

    // ログイン認証後
    Route::middleware('auth:admin')->group(function () {

        /********** ルート **********/
        Route::get('/home', 'HomeController@index')->name('home');

        /********** ユーザ管理(users) **********/
        Route::resource('users', 'UserController');
        
        /********** 記事管理(articles) **********/
        Route::resource('articles', 'ArticleController')->middleware('dataFilter');
        
        /********** ニュース管理(news) **********/
        Route::resource('news', 'NewsController');

        /**
         * Api通信ルート
         */
        /********** ユーザ一覧(users) **********/
        Route::get('ajax/users', 'UserController@apiIndex')->name('api_user');
        /********** 記事一覧(articles) **********/
        Route::get('ajax/articles', 'ArticleController@apiIndex')->name('api_article');
        /********** ニュース一覧(news) **********/
        Route::get('ajax/news', 'NewsController@apiIndex')->name('api_news');
        /********** フレンド一覧(friends) **********/
        Route::get('ajax/users/{user}/friends', 'UserController@apiFriendsIndex')->name('api_friends');
        /********** フレンド削除(friends) **********/
        Route::delete('users/{user}/friends/{frend_id}', 'UserController@friendsDestroy')->name('api_friends.destroy');
        /********** いいね一覧(likes) **********/
        Route::get('ajax/articles/{article}/likes', 'ArticleController@apiLike')->name('api_articles.likes.index');
        /********** いいね新規作成(likes) **********/
        Route::post('ajax/articles/{article}/likes/create', 'ArticleController@apiLikeCreate')->name('api_article.likes.create');
        /********** いいね更新(likes) **********/
        Route::post('ajax/articles/{article}/likes/update', 'ArticleController@apiLikeUpdate')->name('api_article.likes.update');
        /********** いいね削除(likes) **********/
        Route::delete('ajax/articles/{article}/likes/destroy', 'ArticleController@apiLikeDestroy')->name('api_article.likes.destroy');
        /********** コメント一覧(comments) **********/
        Route::get('ajax/articles/{article}/comments', 'ArticleController@apiComment')->name('api_articles.comments.index');
        /********** コメント削除(comments) **********/
        Route::delete('ajax/articles/{article}/comments', 'ArticleController@apiCommentDestroy')->name('api_articles.comments.destroy');
        /********** メッセージ一覧(送信者リスト)(messages) **********/
        Route::get('ajax/users/{user}/messages', 'UserController@apiSenderIndex')->name('api_senders');
        /********** メッセージ一覧(メッセージリスト)(messages) **********/
        Route::get('ajax/users/{user}/messages/{sender}', 'UserController@apiMessagesIndex')->name('api_messages');
        /********** メッセージ削除(messages) **********/
        Route::post('ajax/users/{user}/messages/destroy', 'UserController@apiMessagesDestroy')->name('api_messages.destroy');
    });
});


/**
 * フロントページのルーティング
 * 
 */
Route::namespace('Web')->group(function(){

    /********** 認証管理(login) **********/
    Auth::routes(['register' => false, 'reset' => false, 'verify' => false]);

    /********** ルート **********/
    Route::get('/', 'HomeController@index')->name('home');

    /********** 記事管理(articles) **********/
    Route::get('/articles',             'ArticleController@index')->name('articles.index');
    Route::get('/articles/create',      'ArticleController@create')->name('articles.create');
    Route::get('/articles/{id}',        'ArticleController@show')->name('articles.show');
    Route::get('/articles/{id}/edit',   'ArticleController@edit')->name('articles.edit');
    Route::get('/map',                  'ArticleController@index')->name('articles.map');
    Route::get('/map/location',         'ArticleController@index')->name('articles.map.location');

    /********** ユーザ管理(users) **********/
    Route::get('/users',             'UserController@index')->name('users.index');
    Route::get('/users/create',      'UserController@create')->name('users.create');
    Route::get('/users/{id}',        'UserController@show')->name('users.show');
    Route::get('/users/{id}/edit',   'UserController@edit')->name('users.edit');

    /******************** メッセージ管理(messages) ********************/
    Route::get('/messages',             'MessageController@index')->name('messages.index');
    Route::get('/messages/create',      'MessageController@create')->name('messages.create');
    Route::get('/messages/{id}/edit',   'MessageController@edit')->name('messages.edit');
    Route::get('/messages/{id}',        'MessageController@show')->name('messages.show');

    /******************** ニュース管理(news) ********************/
    Route::get('/news',             'NewsController@index')->name('news.index');

    /********** 認証管理(logout) **********/
    Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
});
