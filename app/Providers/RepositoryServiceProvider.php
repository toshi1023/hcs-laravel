<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Model\User;
use App\Model\Article;
use App\Model\Prefecture;

use App\Consts\Consts;
use App\DataProvider\DatabaseInterface;
use App\DataProvider\ArticleRepository;
use App\DataProvider\UserRepository;

class RepositoryServiceProvider extends ServiceProvider
{   

    protected $current_url;

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {   
        // 現在のURLを変数に代入
        $this->current_url = url()->current();

        // 現在のURLに'article'という値を含む場合
        if (strpos($this->current_url, Consts::ARTICLE_URL) > 0) {
            // DatabaseInterfaceをArticleRepositoryのインスタンス化で解決
            $this->app->bind(DatabaseInterface::class, function($app) {
            
                return new ArticleRepository(new Article, new User, new Prefecture);

            });
        // 現在のURLに'user','register', 'login'という値を含む場合
        } elseif (strpos($this->current_url, Consts::USER_URL) > 0 ||
            strpos($this->current_url, Consts::REGISTER_URL) > 0 ||
            strpos($this->current_url, Consts::LOGIN_URL) > 0 
        ) {

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
