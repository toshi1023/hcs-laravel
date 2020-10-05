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
            'latitude'   => '135.194583',
            'longitude'  => '34.694740',
            'title'      => '初投稿！',
            'content'    => '今日ヒッチハイクの専門サイトをオープンしました！どんどん盛り上げていきましょう！',
            'user_id'    => 1,
        ]);
        \App\Model\Article::create([
            'prefecture' => '兵庫県',
            'latitude'   => '135.3592599',
            'longitude'  => '34.7440314',
            'title'      => 'どんどん活用してください！',
            'content'    => 'ヒッチハイクが好きならば投稿は大歓迎です！',
            'type'       => 1,
            'user_id'    => 1,
        ]);
        \App\Model\Article::create([
            'prefecture' => '京都府',
            'latitude'   => '135.749619',
            'longitude'  => '35.005816',
            'title'      => 'これからよろしく！',
            'content'    => '一緒にヒッチハイクを盛り上げていきたいです！',
            'type'       => 1,
            'user_id'    => 2,
        ]);
    }
}
