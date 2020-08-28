<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Model\User;
use App\Model\Article;
use App\Model\ArticleImage;
use App\Model\Prefecture;

use App\Consts\Consts;
use App\DataProvider\DatabaseInterface\ArticleDatabaseInterface;
use App\DataProvider\DatabaseInterface\UserDatabaseInterface;
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
        // ArticleDatabaseInterfaceをArticleRepositoryのインスタンス化で解決
        $this->app->bind(ArticleDatabaseInterface::class, function($app) {
        
            return new ArticleRepository(new Article, new ArticleImage, new User, new Prefecture);

        });

        // UserDatabaseInterfaceをUserRepositoryのインスタンス化で解決
        $this->app->bind(UserDatabaseInterface::class, function($app) {
            return new UserRepository(new User, new Prefecture);
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
