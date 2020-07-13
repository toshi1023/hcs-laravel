<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Knp\Snappy\Pdf;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // PDF作成クラスのインスタンス生成
        $this->app->bind(Pdf::class, function () {
            return new Pdf('/usr/local/bin/wkhtmltopdf');
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
