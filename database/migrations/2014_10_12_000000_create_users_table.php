<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id')->comment('ID');
            $table->string('users_photo_name')->nullable()->comment('画像名');
            $table->string('users_photo_path')->nullable()->comment('画像パス');
            $table->string('name')->unique()->comment('ニックネーム');
            $table->string('prefecture')->comment('都道府県');                                      // お気に入り都道府県
            $table->date('birthday')->comment('生年月日');
            $table->boolean('gender')->default(false)->comment('性別');                             // 0: 女性, 1: 男性
            $table->string('email')->unique()->comment('メールアドレス');
            $table->timestamp('email_verified_at')->nullable()->comment('メールアドレス（確認）');
            $table->string('password')->comment('パスワード');
            $table->text('comment')->nullable()->comment('自己紹介文');                             // 自己紹介文
            $table->boolean('status')->default(false)->comment('アカウント停止フラグ');              // アカウント停止フラグ
            $table->text('memo')->nullable()->comment('備考');                                      // 備考
            $table->boolean('delete_flg')->default(false)->comment('削除フラグ');                   // 0: noフラグ, 1: 削除
            $table->timestamp('login_time')->nullable()->comment('最終ログイン日時');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
