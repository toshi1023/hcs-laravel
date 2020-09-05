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
        // faker使う(引数には日本語を設定している)
        // $faker = Faker\Factory::create('ja_JP');

        // レコード15件分出力
        // for($i=0; $i < 15; $i++){
        //     \App\Model\User::create([
        //         'name' => 'test'.$i,
        //         'email' => 'test'.$i.'@nakamarker.co.jp',
        //         'password' => Hash::make("test"),
        //         'device_token' => 'test'.(string)$i,
        //         'status' => 1,
        //         'user_agent' => $faker->userAgent,
        //         'del_flg' => 0,
        //         'update_user_id' => $i + 1,
        //     ]);
        // }

        \App\Model\User::create([
            'prof_photo_name' => 'NoImage',
            'name' => 'root',
            'prefecture' => '兵庫県',
            'birthday' => '1992-1-1',
            'gender' => 0,
            'email' => 'root@xxx.co.jp',
            'password' => Hash::make("root"),
        ]);
    }
}
