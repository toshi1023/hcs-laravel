<?php

use Illuminate\Database\Seeder;

class AdminsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Model\Admin::create([
            'email' => 'root@xxx.co.jp',
            'password' => Hash::make("root"),
        ]);
    }
}
