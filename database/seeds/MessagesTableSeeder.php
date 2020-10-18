<?php

use Illuminate\Database\Seeder;

class MessagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // faker使う(引数には日本語を設定している)
        $faker = Faker\Factory::create('ja_JP');

        // メッセージリスト
        $messages = [
            '元気してるかー？ヒッチハイクにいかん？',
            'あげていた記事の場所ってどこにあるん？',
            'いいところに行ってきたんだね！',
            '今回のヒッチハイク楽しそうでうらやましいよ！',
            '京都に来たんだ！一緒にご飯食べたかったよ！',
            'この辺でおすすめの観光スポットってある？',
            'いま何台くらいの車に乗せてもらった？',
            '最近アップしていた記事本当に面白かったよ！',
        ];

        // レコード20件分出力
        for($i=0; $i < 20; $i++){
            \App\Model\Message::create([
                'user_id_sender'   => $faker->numberBetween(1, 7), // 1~7の間で乱数,
                'user_id_receiver' => $faker->numberBetween(1, 9), // 1~9の間で乱数,
                'content' => $messages[array_rand( $messages )],   // 変数の値をランダムでリターン,
            ]);
        }
    }
}
