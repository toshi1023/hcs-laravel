<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(PrefecturesTableSeeder::class);
        $this->call(AdminsTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(NewsTableSeeder::class);
        $this->call(ArticlesTableSeeder::class);
        $this->call(ArticleImagesTableSeeder::class);
        $this->call(FriendsTableSeeder::class);
        $this->call(LikesTableSeeder::class);
    }
}
