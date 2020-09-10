<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\SubValidation\SubValidation;

class SubVlidationProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // SubValidationのインスタンス化で解決
        $this->app->singleton(SubValidation::class, function($app) {
            return new SubValidation();
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
