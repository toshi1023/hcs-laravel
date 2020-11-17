<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/********** 認証管理(login) **********/
Route::post('/login', 'Api\LoginController@login');

/*************************************************
 *  API(認証不要)
 *************************************************/
Route::group(['middleware' => ['api'], 'prefix'], function() {

    /********** 記事管理(articles) **********/
    Route::resource('api_articles' ,    'Api\ArticleController', ['only' => ['index']]);
    
    /********** ユーザ管理(users) **********/
    // Route::resource('api_users' ,           'Api\UserController', ['only' => ['index', 'show']]);
    Route::resource('api_users',     'Api\UserController');
    Route::get('api_users/show',     'Api\UserController@initShow')->name('api_users.initShow');
    Route::get('api_users/{api_user}/friends',     'Api\UserController@friendsIndex')->name('api_users.friends');
    
    /********** 都道府県管理(prefectures) **********/
    Route::get('api_prefectures',       'Api\UserController@getPrefectures')->name('api_prefectures');

    /********** ニュース管理(news) **********/
    Route::get('api_news',              'Api\NewsController@index')->name('api_news');
    Route::get('api_news/show',     'Api\NewsController@initShow')->name('api_news.initShow');

    Route::resource('api_messages' ,    'Api\MessageController', ['only' => ['index']]);
});


/*************************************************
 *  API(認証必須)
 *************************************************/
Route::group(['middleware' => ['auth:api'], 'prefix'], function() {

    /********** 記事管理(articles) **********/
    Route::resource('api_articles' , 'Api\ArticleController', ['except' => ['index']]);

    /********** ユーザ管理(users) **********/
    // Route::resource('api_users' , 'Api\UserController', ['except' => ['index', 'show']]);

    /********** メッセージ管理(messages) **********/
    Route::resource('api_messages' , 'Api\MessageController', ['except' => ['index']]);
    // Route::resource('api_messages' , 'Api\MessageController');
});
