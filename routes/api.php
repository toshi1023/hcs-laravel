<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Loginルート
Route::post('/login', 'Api\LoginController@login');

// 認証が必要でないルートを設定
Route::group(['middleware' => ['api'], 'prefix'], function() {
    Route::resource('api_articles' , 'Api\ArticleController', ['only' => ['index']]);
    Route::resource('api_users' , 'Api\UserController', ['only' => ['index']]);
});

// 認証が必要なルートを設定
Route::group(['middleware' => ['auth:api'], 'prefix'], function() {
    Route::resource('api_articles' , 'Api\ArticleController', ['except' => ['index']]);
    Route::resource('api_users' , 'Api\UserController', ['except' => ['index']]);
});


