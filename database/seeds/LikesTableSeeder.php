<?php

use Illuminate\Database\Seeder;

class LikesTableSeeder extends Seeder
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

        // レコード20件分出力
        for($i=0; $i < 20; $i++){
            \App\Model\Like::create([
                'article_id' => $faker->numberBetween(1, 4), // 1~4の間で乱数,
                'user_id' => $faker->numberBetween(1, 15), // 1~15の間で乱数,
            ]);
        }
    }
}
