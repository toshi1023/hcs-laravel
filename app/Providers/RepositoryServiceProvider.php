<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Model\User;
use App\Model\Article;
use App\Model\Prefecture;

use App\Consts\Consts;
use App\Service\DatabaseInterface;
use App\DataProvider\ArticleRepository;
use App\DataProvider\UserRepository;

class RepositoryServiceProvider extends ServiceProvider
{

    protected $defer = true;

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {

        // 現在のURLを変数に代入
        $current_url = url()->current();

        // 現在のURLに'article'という値を含む場合
        if (strpos($current_url, Consts::ARTICLE_URL) > 0) {

            // DatabaseInterfaceをArticleRepositoryのインスタンス化で解決
            $this->app->bind(DatabaseInterface::class, function($app) {
                return new ArticleRepository(new Article, new User, new Prefecture);
            });

        // 現在のURLに'user'という値を含む場合
        } elseif (strpos($current_url, Consts::USER_URL) > 0) {

            // DatabaseInterfaceをUserRepositoryのインスタンス化で解決
            $this->app->bind(DatabaseInterface::class, function($app) {
                return new UserRepository(new User, new Prefecture);
            });
        }
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
