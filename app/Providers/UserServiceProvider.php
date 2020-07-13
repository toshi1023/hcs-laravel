<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Service\DatabaseInterface;
use App\Service\UserService;

class UserServiceProvider extends ServiceProvider
{

    protected $defer = true;

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('UserService', UserService::class);
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
