<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Model\Admin;
use App\Model\User;
use App\Model\Article;
use App\Model\Prefecture;
use App\Model\News;
use App\Model\Message;

use App\Consts\Consts;
use App\DataProvider\DatabaseInterface\ArticleDatabaseInterface;
use App\DataProvider\DatabaseInterface\UserDatabaseInterface;
use App\DataProvider\DatabaseInterface\AdminDatabaseInterface;
use App\DataProvider\DatabaseInterface\NewsDatabaseInterface;
use App\DataProvider\DatabaseInterface\MessageDatabaseInterface;
use App\DataProvider\ArticleRepository;
use App\DataProvider\UserRepository;
use App\DataProvider\AdminRepository;
use App\DataProvider\NewsRepository;
use App\DataProvider\MessageRepository;

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
        $this->app->singleton(ArticleDatabaseInterface::class, function($app) {
            return new ArticleRepository(new Article);
        });

        // AdminDatabaseInterfaceをAdminRepositoryのインスタンス化で解決
        $this->app->singleton(AdminDatabaseInterface::class, function($app) {
            return new AdminRepository(new Admin);
        });

        // UserDatabaseInterfaceをUserRepositoryのインスタンス化で解決
        $this->app->singleton(UserDatabaseInterface::class, function($app) {
            return new UserRepository(new User);
        });

        // NewsDatabaseInterfaceをNewsRepositoryのインスタンス化で解決
        $this->app->singleton(NewsDatabaseInterface::class, function($app) {
            return new NewsRepository(new News);
        });

        // MessageDatabaseInterfaceをMessageRepositoryのインスタンス化で解決
        $this->app->singleton(MessageDatabaseInterface::class, function($app) {
            return new MessageRepository(new Message);
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
