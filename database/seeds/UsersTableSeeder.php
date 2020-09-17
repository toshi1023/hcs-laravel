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
            'prof_photo_name' => 'NoImage',
            'prof_photo_path' => env('AWS_NOIMAGE'),
            'name' => 'root',
            'prefecture' => '兵庫県',
            'birthday' => '1992-1-1',
            'gender' => 1,
            'email' => 'root@xxx.co.jp',
            'password' => Hash::make("root"),
        ]);

        // faker使う(引数には日本語を設定している)
        $faker = Faker\Factory::create('ja_JP');

        // レコード14件分出力
        for($i=1; $i < 15; $i++){
            \App\Model\User::create([
                'prof_photo_name' => 'NoImage',
                'prof_photo_path' => env('AWS_NOIMAGE'),
                'name' => 'test'.$i,
                'prefecture' => $faker->prefecture,
                'birthday' => '1993-1-'.$i,
                'gender' => 1,
                'email' => 'test'.$i.'@nakamarker.co.jp',
                'password' => Hash::make("test"),
                // 'user_agent' => $faker->userAgent,
            ]);
        }
    }
}
