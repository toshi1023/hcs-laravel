<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Model\User::create([
            'users_photo_name' => 'NoImage',
            'users_photo_path' => env('AWS_NOIMAGE'),
            'name' => 'root',
            'prefecture' => '兵庫県',
            'birthday' => '1992-1-1',
            'gender' => 1,
            'email' => 'root@xxx.co.jp',
            'password' => Hash::make("root"),
            'comment'  => 'こんにちはrootです！これから盛り上げていきましょう！',
        ]);

        // faker使う(引数には日本語を設定している)
        $faker = Faker\Factory::create('ja_JP');

        // レコード14件分出力
        for($i=1; $i < 15; $i++){
            \App\Model\User::create([
                'users_photo_name' => 'NoImage',
                'users_photo_path' => env('AWS_NOIMAGE'),
                'name' => 'test'.$i,
                'prefecture' => $faker->prefecture,
                'birthday' => '1993-1-'.$i,
                'gender' => $faker->numberBetween(0, 1), // 0~1の間で乱数,
                'email' => 'test'.$i.'@xxx.co.jp',
                'password' => Hash::make("test"),
                'comment'  => 'こんにちはtest'.$i.'です！これからよろしく！',
                // 'user_agent' => $faker->userAgent,
            ]);
        }
    }
}
