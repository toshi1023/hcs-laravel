<?php

use Illuminate\Database\Seeder;

class FriendsTableSeeder extends Seeder
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

        // レコード25件分出力
        for($i=0; $i < 25; $i++){
            \App\Model\Friend::create([
                'user_id' => $faker->numberBetween(1, 15),
                'user_id_target' => $faker->numberBetween(1, 15),
                'status' => $faker->numberBetween(1, 3),
            ]);
        }
    }
}
