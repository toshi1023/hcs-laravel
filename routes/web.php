<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// ルートページ
Route::get('/', 'HomeController@index')->name('home');

// 記事関連のルート
Route::resource('articles', 'ArticleController');

// ユーザ関連のルート
Route::resource('users', 'UserController');
// ユーザデータのPDF出力ルート
Route::get('users/pdf', 'UserController@pdf')->name('pdf');

// 認証機能のルーティング(laravel7.5.2では"php artisan ui vue --auth"のコマンドが事前に必要)
Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
