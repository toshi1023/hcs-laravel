<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Model\Article;
use App\Model\ArticleImage;
use App\Model\Comment;
use App\Model\Friend;
use App\Model\Like;
use App\Model\Admin;
use App\Model\User;
use App\Model\News;
use App\Model\Prefecture;
// use App\Model\Friend;
use App\Model\Message;

class NewModelServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // 'articles'テーブルをインスタンス化して返す
        $this->app->singleton('articles', function($app) {
            return new Article;
        });
        // 'article_images'テーブルをインスタンス化して返す
        $this->app->singleton('article_images', function($app) {
            return new ArticleImage;
        });
        // 'comments'テーブルをインスタンス化して返す
        $this->app->singleton('comments', function($app) {
            return new Comment;
        });
        // 'likes'テーブルをインスタンス化して返す
        $this->app->singleton('likes', function($app) {
            return new Like;
        });
        // 'admins'テーブルをインスタンス化して返す
        $this->app->singleton('admins', function($app) {
            return new Admin;
        });
        // 'users'テーブルをインスタンス化して返す
        $this->app->singleton('users', function($app) {
            return new User;
        });
        // 'news'テーブルをインスタンス化して返す
        $this->app->singleton('news', function($app) {
            return new News;
        });
        // 'prefectures'テーブルをインスタンス化して返す
        $this->app->singleton('prefectures', function($app) {
            return new Prefecture;
        });
        // // 'friends'テーブルをインスタンス化して返す
        $this->app->bind('friends', function($app) {
            return new Friend;
        });
        // 'messages'テーブルをインスタンス化して返す
        $this->app->bind('messages', function($app) {
            return new Message;
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
