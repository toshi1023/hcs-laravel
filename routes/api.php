<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/********** 認証管理(login) **********/
Route::post('/login', 'Api\LoginController@login');

/**
 * 認証が必要でないルート
 */
Route::group(['middleware' => ['api'], 'prefix'], function() {

    /********** 記事管理(articles) **********/
    Route::resource('api_articles' , 'Api\ArticleController', ['only' => ['index']]);
    
    /********** ユーザ管理(users) **********/
    Route::resource('api_users' , 'Api\UserController', ['only' => ['index', 'show']]);

});


/**
 * 認証が必要なルート
 */
Route::group(['middleware' => ['auth:api'], 'prefix'], function() {

    /********** 記事管理(articles) **********/
    Route::resource('api_articles' , 'Api\ArticleController', ['except' => ['index']]);

    /********** ユーザ管理(users) **********/
    Route::resource('api_users' , 'Api\UserController', ['except' => ['index', 'show']]);

    /********** メッセージ管理(messages) **********/
    Route::resource('api_messages' , 'Api\MessageController');
});


