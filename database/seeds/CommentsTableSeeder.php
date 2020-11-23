<?php

use Illuminate\Database\Seeder;

class CommentsTableSeeder extends Seeder
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
        // コメントリスト
        $messages = [
            '今度一緒に行きたいですね！',
            '楽しそうだね！',
            'いいところに行ってきたんだね！',
            '今回のヒッチハイク楽しそうでうらやましいよ！',
            'どのくらいの期間で回ってきたんですかー？',
            'この辺でおすすめの観光スポットってある？',
            'いま何台くらいの車に乗せてもらった？',
            '最近アップしていた記事本当に面白かったよ！',
            'いつも楽しみに見ています！',
            '今度来たときは車乗せますよー！！',
            '君の記事をきっかけにヒッチハイク初挑戦しました！',
        ];

        // レコード30件分出力
        for($i=0; $i < 30; $i++){
            \App\Model\Comment::create([
                'article_id'         => $faker->numberBetween(1, 10), // 1~10の間で乱数,
                'user_id'            => $faker->numberBetween(2, 15), // 2~15の間で乱数,
                'comment'            => $messages[array_rand( $messages )],   // 変数の値をランダムでリターン,
            ]);
        }
    }
}
