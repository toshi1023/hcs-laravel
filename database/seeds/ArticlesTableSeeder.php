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
            'latitude'   => 135.194583,
            'longitude'  => 34.694740,
            'title'      => '初投稿！',
            'content'    => '今日ヒッチハイクの専門サイトをオープンしました！どんどん盛り上げていきましょう！',
            'user_id'    => 1,
        ]);
        \App\Model\Article::create([
            'prefecture' => '兵庫県',
            'latitude'   => 135.3592599,
            'longitude'  => 34.7440314,
            'title'      => 'どんどん活用してください！',
            'content'    => 'ヒッチハイクが好きならば投稿は大歓迎です！',
            'user_id'    => 1,
        ]);
        \App\Model\Article::create([
            'prefecture' => '京都府',
            'latitude'   => 135.749619,
            'longitude'  => 35.005816,
            'title'      => 'これからよろしく！',
            'content'    => '一緒にヒッチハイクを盛り上げていきたいです！',
            'user_id'    => 2,
        ]);
        \App\Model\Article::create([
            'prefecture' => '東京都',
            'latitude'   => 139.734465,
            'longitude'  => 35.686373,
            'title'      => '初めまして！',
            'content'    => '東京に来たときは声をかけてくださいね！',
            'user_id'    => 3,
        ]);
        \App\Model\Article::create([
            'prefecture' => '神奈川県',
            'latitude'   => 139.489847,
            'longitude'  => 35.339005,
            'title'      => '募集中！',
            'content'    => '東北ヒッチハイク周遊を予定しています！参加希望者はメッセージくださいねー！',
            'type'       => 1,
            'user_id'    => 4,
        ]);
        \App\Model\Article::create([
            'prefecture' => '北海道',
            'latitude'   => 141.001735,
            'longitude'  => 43.193879,
            'title'      => '北海道満喫中ー',
            'content'    => '昨日から北海道でヒッチハイク始めましたー！景色もきれいだし、いい人ばかりで最高ですよー',
            'type'       => 1,
            'user_id'    => 5,
        ]);
        \App\Model\Article::create([
            'prefecture' => '東京都',
            'latitude'   => 139.734560,
            'longitude'  => 35.686373,
            'title'      => '東京にいるどなたかー',
            'content'    => '銚子行きの車を希望してます！どなたか乗せていただけると助かります！！',
            'type'       => 1,
            'user_id'    => 6,
        ]);
        \App\Model\Article::create([
            'prefecture' => '広島県',
            'latitude'   => 132.526304,
            'longitude'  => 34.372091,
            'title'      => '広島おすすめ！',
            'content'    => '紅葉シーズンの広島は景色最高ですよー！！',
            'user_id'    => 7,
        ]);
        \App\Model\Article::create([
            'prefecture' => '大阪府',
            'latitude'   => 135.503164,
            'longitude'  => 34.670094,
            'title'      => '大阪で飲んでるなう',
            'content'    => '大阪に来た人！おごりますんで、一緒に飲みましょー！！',
            'user_id'    => 8,
        ]);
        \App\Model\Article::create([
            'prefecture' => '福岡県',
            'latitude'   => 130.402659,
            'longitude'  => 33.588587,
            'title'      => '福岡おすすめラーメン店！',
            'content'    => '博多に来たら絶対に海鳴のラーメンを食べるべし！あっさりした豚骨スープが癖になりますよ！',
            'type'       => 1,
            'user_id'    => 9,
        ]);
    }
}
