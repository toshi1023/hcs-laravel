<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Knp\Snappy\Pdf;
use App\Service\ArticleService;
use App\Service\UserService;

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

        // Serviceファイルのインスタンス生成サービスを登録
        $this->app->bind('ArticleService', ArticleService::class);
        $this->app->bind('UserService', UserService::class);
        $this->app->bind('AdminService', AdminService::class);
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
