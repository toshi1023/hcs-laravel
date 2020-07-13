<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Service\DatabaseInterface;
use App\Service\ArticleService;

class ArticleServiceProvider extends ServiceProvider
{

    protected $defer = true;

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('ArticleService', ArticleService::class);
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
