<?php

use Illuminate\Database\Seeder;

class ArticlesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Model\Article::create([
            'prefecture' => '兵庫県',
            'title'      => '初投稿！',
            'content'    => '今日ヒッチハイクの専門サイトをオープンしました！どんどん盛り上げていきましょう！',
            'user_id'    => 1,
        ]);
        \App\Model\Article::create([
            'prefecture' => '兵庫県',
            'title'      => 'どんどん活用してください！',
            'content'    => 'ヒッチハイクが好きならば投稿は大歓迎です！',
            'user_id'    => 1,
        ]);
    }
}
