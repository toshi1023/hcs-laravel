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
    }
}
