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
    Route::resource('api_articles' ,      'Api\ArticleController', ['only' => ['index']]);
    Route::get('api_articles/home' ,      'Api\ArticleController@home')->name('api_articles.home');
    
    /********** ユーザ管理(users) **********/
    Route::resource('api_users' ,           'Api\UserController', ['only' => ['index', 'show']]);
    Route::post('api_users/validation',   'Api\UserController@validation')->name('api_users.validation');
    
    /********** 都道府県管理(prefectures) **********/
    Route::get('api_prefectures',       'Api\UserController@getPrefectures')->name('api_prefectures');

    /********** ニュース管理(news) **********/
    Route::get('api_news',              'Api\NewsController@index')->name('api_news');
    Route::get('api_news/show',         'Api\NewsController@initShow')->name('api_news.initShow');

});


/*************************************************
 *  API(認証必須)
 *************************************************/
Route::group(['middleware' => ['auth:api'], 'middleware' => 'session.check'], function() {

    /********** 記事管理(articles) **********/
    Route::resource('api_articles' ,            'Api\ArticleController', ['except' => ['index', 'create', 'edit', 'show']])->middleware('dataFilter');
    Route::get('api_articles/likes' ,           'Api\ArticleController@likes')->name('api_articles.likes.index');
    Route::post('api_articles/likes' ,          'Api\ArticleController@likesUpdate')->name('api_articles.likes.update');
    Route::get('api_articles/comments' ,        'Api\ArticleController@comments')->name('api_articles.comments.index');
    Route::get('api_articles/comments/counts' , 'Api\ArticleController@commentsCounts')->name('api_articles.comments.counts');
    Route::post('api_articles/comments' ,       'Api\ArticleController@commentsUpdate')->name('api_articles.comments.update');

    /********** ユーザ管理(users) **********/
    Route::resource('api_users' , 'Api\UserController', ['except' => ['index', 'show']]);
    Route::get('api_users/{api_user}/friends',          'Api\UserController@friendsIndex')->name('api_users.friends');
    Route::get('api_users/{api_user}/friends/apply',    'Api\UserController@friendsApply')->name('api_users.friends.apply');
    Route::post('api_users/{api_user}/friends/update',   'Api\UserController@friendsUpdate')->name('api_users.friends.update');

    /********** メッセージ管理(messages) **********/
    Route::get('api_messages' ,         'Api\MessageController@index')->name('api_messages');
    Route::get('api_messages/show' ,    'Api\MessageController@show')->name('api_messages.initShow');
    Route::post('api_messages/update' ,    'Api\MessageController@update')->name('api_messages.update');
});
