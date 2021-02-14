<?php

namespace Tests\Browser\Admin;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\Model\User;

class LoginTest extends DuskTestCase
{
    // public function elements()
    // {
    //     return [
    //         '@login-button' => 'button[type="submit"]',
    //     ];
    // }

    /**
     * ログインテスト(失敗時)
     * ※入力値の不正
     *
     * @return void
     */
    public function testLoginValueError()
    {
        // テスト処理
        $this->browse(function (Browser $browser) {
            // $browser->visit(config('test_const.login_url'))
            //         ->clickLink('ログイン')
            //         ->assertPathIs(config('test_const.login_url'));

            $browser->visit(config('test_const.login_url'))
                    ->resize(1920, 1080)
                    ->assertSee('ログイン')
                    ->type(config('test_const.email'), 'error@xxx.co.jp')
                    ->type(config('test_const.password'), 'error')
                    // ->press('@login-button')
                    // ->assertSee(config('test_const.login_error_message'));
            $browser->screenshot('error');
        });
    }

    /**
     * ログインテスト(失敗時)
     * ※権限不足
     *
     * @return void
     */
    public function testLoginStatusError()
    {
        // ユーザ情報取得
        $user = User::where(config('test_const.db_column_status'), '=', config('const.app_member'))->first();
        // テスト処理
        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit(config('test_const.login_url'))
                    ->assertSee('ログイン')
                    ->maximize()
                    ->type(config('test_const.email'), $user->email)
                    ->type(config('test_const.password'), config('test_const.db_value_password_error'))
                    ->click('@login-button')
                    ->assertSee(config('test_const.login_error_message'));
        });
    }

    /**
     * ログインテスト(成功時)
     *
     * @return void
     */
    public function testLogin()
    {
        // ユーザ情報取得
        $user = User::find(1);
        // テスト処理
        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit(config('test_const.login_url'))
                    ->assertSee('ログイン')
                    ->type(config('test_const.email'), $user->email)
                    ->type(config('test_const.password'), config('test_const.db_value_password_success'))
                    ->click('button[type="submit"]')
                    ->assertPathIs(config('test_const.home_url'))
                    ->assertSee(config('test_const.admin_login_message'));
        });
    }
}
