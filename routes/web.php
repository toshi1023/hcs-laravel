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

// ログイン機能のルーティング
Route::get('/login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('/login', 'Auth\LoginController@login')->name('postlogin');

// ルートページ
Route::get('/', 'HomeController@index')->name('home');

Route::get('/welcome', 'HomeController@welcome')->name('welcome');

// 記事関連のルート
Route::resource('articles', 'ArticleController');

// ユーザ関連のルート
Route::resource('users', 'UserController');
// ユーザデータのPDF出力ルート
Route::get('users/pdf', 'UserController@pdf')->name('users.pdf');

// ログアウト機能のルーティング
Route::post('/logout', 'Auth\LoginController@logout')->name('logout');