<?php

namespace Tests\Browser\Admin;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class PageViewTest extends DuskTestCase
{

    /**
     * ページ遷移の確認
     *
     * @return void
     */
    public function testAllPageView()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->assertSee('HitcHike Community Space');
        });
    }
}
