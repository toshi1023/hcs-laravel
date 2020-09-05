<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Model\Admin;
use App\Model\User;
use App\Model\Article;
use App\Model\ArticleImage;
use App\Model\Prefecture;

use App\Consts\Consts;
use App\DataProvider\DatabaseInterface\ArticleDatabaseInterface;
use App\DataProvider\DatabaseInterface\UserDatabaseInterface;
use App\DataProvider\DatabaseInterface\AdminDatabaseInterface;
use App\DataProvider\ArticleRepository;
use App\DataProvider\UserRepository;
use App\DataProvider\AdminRepository;

class RepositoryServiceProvider extends ServiceProvider
{   

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {   
        // ArticleDatabaseInterfaceをArticleRepositoryのインスタンス化で解決
        $this->app->bind(ArticleDatabaseInterface::class, function($app) {
            return new ArticleRepository(new Article, new ArticleImage);
        });

        // AdminDatabaseInterfaceをAdminRepositoryのインスタンス化で解決
        $this->app->bind(AdminDatabaseInterface::class, function($app) {
            return new AdminRepository(new Admin);
        });

        // UserDatabaseInterfaceをUserRepositoryのインスタンス化で解決
        $this->app->bind(UserDatabaseInterface::class, function($app) {
            return new UserRepository(new User);
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
