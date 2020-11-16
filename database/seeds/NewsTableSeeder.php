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
            'type'  => 1,
            'title' => 'HCSへようこそ！',
            'content' => 'ヒッチハイク専門のコミュニティサイトをオープンしました！',
            'status' => 1,
            'member_flg' => 0,
            'admin_id' => 1,
        ]);
        \App\Model\News::create([
            'type'  => 2,
            'title' => '台風が近づいています！',
            'content' => '翌週あたりに台風が日本列島を直撃しますので、ヒッチハイクは控えるようにしてください！',
            'status' => 1,
            'member_flg' => 0,
            'admin_id' => 1,
        ]);
        \App\Model\News::create([
            'type'  =>1,
            'title' => '不具合を修正しました！',
            'content' => 'ログインが出来ない不具合の修正を対応しました。ご迷惑をおかけしたこと、大変深くお詫び申し上げます。',
            'status' => 1,
            'member_flg' => 1,
            'admin_id' => 1,
        ]);
        \App\Model\News::create([
            'type'  => 2,
            'title' => 'コロナ感染には十分にご注意を！',
            'content' => '日本全国でコロナ感染者が増えて来ていますので、ヒッチハイクをする方は十分な感染対策を行ってください！',
            'status' => 1,
            'member_flg' => 0,
            'admin_id' => 1,
        ]);
        \App\Model\News::create([
            'type'  => 1,
            'title' => '登録者100人突破！',
            'content' => '当サイトの登録者が100人突破しました！ぜひ、これからもヒッチハイク情報を共有してコミュニティを有効活用してください。',
            'status' => 1,
            'member_flg' => 1,
            'admin_id' => 1,
        ]);
        \App\Model\News::create([
            'type'  => 1,
            'title' => '広島県の人気急上昇中',
            'content' => 'ここ数か月に広島県の記事投稿数が増加しています！この機会に訪問してみましょう！',
            'status' => 1,
            'member_flg' => 0,
            'admin_id' => 1,
        ]);
    }
}
