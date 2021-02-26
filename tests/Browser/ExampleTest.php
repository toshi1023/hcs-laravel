<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\Model\User;

class ExampleTest extends DuskTestCase
{
    /**
     * A basic browser test example.
     *
     * @return void
     */
    public function testBasicExample()
    {
        $this->browse(function (Browser $browser) {
            $browser->loginAs(User::find(1))
                    ->visit('/hcs-admin/home')
                    ->assertSee('ログアウト')
                    // ->assertAuthenticated();
                    ->assertPathIs('/hcs-admin/home');
            $browser->screenshot('error');
        });
    }
}
