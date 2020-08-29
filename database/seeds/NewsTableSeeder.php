<?php

use Illuminate\Database\Seeder;

class NewsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Model\News::create([
            'title' => 'HCSへようこそ！',
            'content' => 'ヒッチハイク専門のコミュニティサイトをオープンしました！',
            'status' => 1,
            'type' => 0,
            'admin_id' => 1,
        ]);
    }
}
